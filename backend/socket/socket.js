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


const roomSocketMap = {}; // {roomId: {name: roomName, userId: userId}};
const roomUserMap = {}; // {roomId: [userId]};

const userSocketMap = {}; // {userId: socketId};

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

    socket.on("disconnect", () => {
        console.log("Client déconnecté");
        delete userSocketMap[userId];
        io.emit('onlineUsers', Object.keys(userSocketMap));
    });
});




module.exports = {app, io, server};