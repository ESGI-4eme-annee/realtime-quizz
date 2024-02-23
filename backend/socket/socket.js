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

    const userEmail = socket.handshake.query.userEmail;
    if (userEmail != "undefined") {
        userSocketMap[userEmail] = socket.id;

        // Envoi de la liste des utilisateurs connectés
        io.emit('onlineUsers', Object.keys(userSocketMap));
        io.emit('roomCreated', roomSocketMap);
        
    }

    room(socket,io);

    quizz(socket,io);

    socket.on("disconnect", () => {
        console.log("Client déconnecté");
        delete userSocketMap[userEmail];
        io.emit('onlineUsers', Object.keys(userSocketMap));
    });
});

function room(socket,io)  {

    socket.on('createRoom', (socket) => {
        const roomId = socket.roomId;
        const roomName = socket.roomName;
        const password = socket.password;
        if (roomId != "undefined") {
            roomSocketMap[roomId] = {name : roomName, userEmail:socket.userEmail, password:password, state : true};
        }

        io.emit('roomCreated', roomSocketMap);
    });

    socket.on('joinRoom', (data) => {
        const roomId = data.roomId;
        const userEmail = data.userEmail;
        const userId = data.userId;

        if (roomSocketMap[roomId])
        {
            socket.join(roomId);
            io.to(roomId).emit('userJoinedRoom', userEmail);

            roomUserMap[roomId] = roomUserMap[roomId] || [];

            const userObject = {userEmail: userEmail, userId: userId};
            if (!roomUserMap[roomId].some(user => user.userId === userId)) {
                roomUserMap[roomId].push(userObject);
            }
            io.to(roomId).emit('roomUsers', roomUserMap[roomId]);

            console.log(`Le client ${userEmail} a rejoint le salon ${roomId}`);

        } else 
        {
            console.log(`Le salon ${userEmail} n'existe pas`);
        }

    });
    socket.on('leaveRoom', (data) => {
        const userEmail = data.userEmail;

        const roomsJoined = socket.rooms;

        roomsJoined?.forEach(room => {
            socket.leave(room);

            const userIndex = roomUserMap[room]?.findIndex(user => user.userEmail === userEmail);
            console.log('userIndex', userIndex);

            if (roomUserMap[room]) {
                roomUserMap[room].splice(userIndex, 1);
            }
            console.log('roomUserMap', roomUserMap[room]);

        io.to(room).emit('roomUsers', roomUserMap[room]);
        });


    });
    socket.on('startQuizz', () => {
        let time = 5;
        io.emit('timerBeforeStart', time);
        let interval = setInterval(() => {
            time--;
            if (time < 0) {
                io.emit('alertQuizzStarting', {
                    title: 'Le quizz commence 🏁',
                    message: 'Bon courage ! 💪'
                });
                return clearInterval(interval);
            }
            io.emit('timerBeforeStart', time);
        }, 1000);
    });
}

const roomQuizzMap = {};
const roomQuizzProgressMap = {};
const questionResponseMap = {};
const scoreUserMap = {};

function quizz(socket,io) {
    socket.on('sendQuizz', (data) => {
        const roomId = data.salle;
        const quizz = data.quizz;
        const quizzId = quizz.id;
        const quizzName = quizz.name;
        const quizzQuestions = quizz.Questions;
        let time = 0;//ca prend +1 a chaque fin de temps de question pour passer a la question suivante

        roomQuizzMap[roomId] = {"name":quizzName, "questions":quizzQuestions};

        roomSocketMap[roomId].state = false;
        io.emit('roomCreated', roomSocketMap);
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

            let responseId = questionResponseMap[roomId][quizzId][quizzQuestions[time].id];
            io.to(roomId).emit('responseValid', {"response":responseId});

            // calccul du score
            if (!scoreUserMap[roomId]) {
                scoreUserMap[roomId] = {};
            }
            if (!scoreUserMap[roomId][quizzId]) {
                scoreUserMap[roomId][quizzId] ={};
            }

            for (const user in roomQuizzProgressMap[roomId][ quizzId][quizzQuestions[time].id]) {
                if (!scoreUserMap[roomId][ quizzId][user]) {
                    scoreUserMap[roomId][ quizzId][user] = 0;
                }
               if(roomQuizzProgressMap[roomId][ quizzId][quizzQuestions[time].id][user] === questionResponseMap[roomId][quizzId][quizzQuestions[time].id]){

                scoreUserMap[roomId][ quizzId][user] +=1;
               }
            }
            io.to(roomId).emit('scoreQuizz', scoreUserMap[roomId][quizzId]);
            console.log("scoreUserMap", scoreUserMap[roomId][quizzId]);

            setTimeout(() => {
                io.emit('alertQuestionWillEnd', {
                    title: 'La question va bientôt se terminer !',
                    message: 'Il ne reste plus que quelques secondes pour répondre'
                });
            }, 2000);

            //question suivante
            setTimeout(function() {
                io.to(roomId).emit('responseValid', null);
                time++;
               io.to(roomId).emit('question', {"question":roomQuizzMap[roomId].questions[time], "idQuizz": quizzId});
               io.emit('alertNextQuestion', {
                   title: 'Question suivante',
                   message: 'La question suivante commence'
               });
            }, 5000);
        }, 5000);
    });

    //response envoyer par les joueurs
    socket.on('sendResponse', (userId, salle, idQuizz, idQuestion, idResponse) => {
        roomQuizzProgressMap[salle] ??= {};
        roomQuizzProgressMap[salle][idQuizz] ??= {};
        roomQuizzProgressMap[salle][idQuizz][idQuestion] ??= {};
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