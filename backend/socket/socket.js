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
        console.log("je passe dans le user != undifined");
        userSocketMap[userId] = socket.id;

        // Envoi de la liste des utilisateurs connectés
        io.emit('onlineUsers', Object.keys(userSocketMap));
        console.log("userSocketMap", userSocketMap);
        io.emit('roomCreated', roomSocketMap);
        
    }

    room(socket,io);

    quizz(socket,io);

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
}

const roomQuizzMap = {}; // {roomId: quizz}; : liste des salles et des quizz qui les ont créées
const roomQuizzProgressMap = {}; // {roomId: {time: time, question: question}}; : liste des salles et des quizz qui les ont créées

function quizz(socket,io) {
    socket.on('sendQuizz', (data) => {
        console.log("data", data);
        roomQuizzMap[data.salle] = {"name":data.quizz.name, "questions":data.quizz.Questions};
        console.log("roomQuizzMap", roomQuizzMap[data.salle]);
        
        let time = 0;
        io.to(data.salle).emit('question', {"question":roomQuizzMap[data.salle].questions[time], "idQuizz": data.quizz.id});
        console.log(roomQuizzMap[data.salle].questions[time]);
    });
    
    
    socket.on('sendResponse', (userId, salle, idQuizz, idQuestion, idResponse) => {
        console.log("sendResponse", userId, salle, idQuizz, idQuestion, idResponse);
    
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