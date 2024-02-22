const  { Server } = require ('socket.io');
const http = require  ('http');
const express = require  ('express');

const app = express();

const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: "http://localhost:5173",
        methods: ["GET", "POST"],
        credentials: true
    }
});


const roomSocketMap = {}; // {roomId: {name: roomName, userId: userId}}; : liste des salles et des utilisateurs qui les ont créées

const roomUserMap = {}; // {roomId: [userId]}; : toues les salles et les utilisateurs qui sont dedans

const userSocketMap = {}; // {userId: socketId}; : liste des utilisateurs connectés


io.on('connection', (socket) => {
    console.log('Un client est connecté', socket.id);

    const userId = socket.handshake.query.userId;
    if (userId != "undefined") {
        userSocketMap[userId] = socket.id;

        // Envoi de la liste des utilisateurs connectés
        io.emit('onlineUsers', Object.keys(userSocketMap));
        io.emit('roomCreated', roomSocketMap);
        
    }

    room(socket,io);

    quizz(socket,io,userId);

    socket.on("disconnect", () => {
        console.log("Client déconnecté");
        delete userSocketMap[userId];
        io.emit('onlineUsers', Object.keys(userSocketMap));
    });
});




function room(socket,io)  {

    socket.on('createRoom', (socket) => {
        const roomId = socket.roomId;
        const roomName = socket.roomName;
        if (roomId != "undefined") {
            roomSocketMap[roomId] = {name : roomName, userId:socket.userId};
        }

        io.emit('roomCreated', roomSocketMap);
    });

    socket.on('joinRoom', (data) => {
        const roomId = data.roomId;
        const userId = data.userId;

        if (roomSocketMap[roomId])
        {
            socket.join(roomId);
            io.to(roomId).emit('userJoinedRoom', userId);

            roomUserMap[roomId] = roomUserMap[roomId] || [];
            if (!roomUserMap[roomId].includes(userId)) {
            roomUserMap[roomId].push(userId);
            }
            io.to(roomId).emit('roomUsers', roomUserMap[roomId]);

            console.log(`Le client ${userId} a rejoint le salon ${roomId}`);
        } else 
        {
            console.log(`Le salon ${roomId} n'existe pas`);
        }
       
    });
    socket.on('leaveRoom', (data) => {
        const userId = data.userId;

        const roomsJoined = socket.rooms;

        roomsJoined?.forEach(room => {
            socket.leave(room);
        console.log(`Le client ${userId} a quitté le salon ${room}`);
        const userIndex = roomUserMap[room]?.indexOf(userId);
    
        if (roomUserMap[room] && userIndex !== -1) {
            roomUserMap[room].splice(userIndex, 1);
        }
        io.to(room).emit('roomUsers', roomUserMap[room]);
        });
        
       
    });
}

const roomQuizzMap = {}; // {roomId: quizz}; : liste des salles et des quizz qui les ont créées
const roomQuizzProgressMap = {}; // {roomId: {time: time, question: question}}; : liste des salles et des quizz qui les ont créées
const questionResponseMap = {}; // {}}; 
const scoreUserMap = {}; // {roomId: {userId: score}}; : liste des salles et des utilisateurs et leur score

function quizz(socket,io) {
    socket.on('sendQuizz', (data) => {
        const roomId = data.salle;
        const quizz = data.quizz;
        const quizzId = quizz.id;
        const quizzName = quizz.name;
        const quizzQuestions = quizz.Questions;
        let time = 1;//ca prend +1 a chaque fin de temps de question pour passer a la question suivante

        roomQuizzMap[roomId] = {"name":quizzName, "questions":quizzQuestions};

        io.to(roomId).emit('question', {"question":roomQuizzMap[roomId].questions[time], "idQuizz": quizzId});
        
        //reponse a la question
        setTimeout(function() {
            if (!questionResponseMap[roomId]) {
                questionResponseMap[roomId] = {};
            }
            if (!questionResponseMap[roomId][quizzId]) {
                questionResponseMap[roomId][quizzId] = {};
            }
            questionResponseMap[roomId][quizzId][quizzQuestions[time].id] = quizzQuestions[time].Answers.find(answer => answer.valid === true).id;

            io.to(roomId).emit('responseValid', {"response":questionResponseMap[roomId][quizzId][quizzQuestions[time].id]});

            // calccul du score
            if (!scoreUserMap[roomId]) {
                scoreUserMap[roomId] = {};
            }
            if (!scoreUserMap[roomId][ quizzId]) {
                scoreUserMap[roomId][ quizzId] ={};
            }
        
            for (const user in roomQuizzProgressMap[roomId][ quizzId][quizzQuestions[time].id]) {
                if (!scoreUserMap[roomId][ quizzId][user]) {
                    scoreUserMap[roomId][ quizzId][user] = 0;
                }
               if(roomQuizzProgressMap[roomId][ quizzId][quizzQuestions[time].id][user] === questionResponseMap[roomId][quizzId][quizzQuestions[time].id]){
                
                scoreUserMap[roomId][ quizzId][user] +=1;
               }
            }
            
            console.log("scoreUserMap", scoreUserMap[roomId][quizzId]);

            //question suivante
            setTimeout(function() {
                time--;
               io.to(roomId).emit('question', {"question":roomQuizzMap[roomId].questions[time], "idQuizz": quizzId});
            }, 5000); 
    
        }, 5000);

       
    });
    
    //response envoyer par les joueurs
    socket.on('sendResponse', (userId, salle, idQuizz, idQuestion, idResponse) => {
    
        if (!roomQuizzProgressMap[salle]) {
            roomQuizzProgressMap[salle] = {};
        }
    
        if (!roomQuizzProgressMap[salle][idQuizz]) {
            roomQuizzProgressMap[salle][idQuizz] = {};
        }
    
        if (!roomQuizzProgressMap[salle][idQuizz][idQuestion]) {
            roomQuizzProgressMap[salle][idQuizz][idQuestion] = {};
        }
    
        roomQuizzProgressMap[salle][idQuizz][idQuestion][userId] = idResponse;

        console.log("roomQuizzProgressMap", roomQuizzProgressMap[salle][idQuizz][idQuestion]);
    
        const responseCounts = Object.values(roomQuizzProgressMap[salle][idQuizz][idQuestion]).reduce((acc, value) => {
            acc[value] = (acc[value] || 0) + 1;
            return acc;
        }, {});

        io.to(salle).emit('responseCounts', responseCounts);

    });
}





module.exports = {app, io, server};