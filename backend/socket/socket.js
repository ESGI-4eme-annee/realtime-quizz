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

const userSocketMap = {}; // {userId: socketId};

io.on('connection', (socket) => {
    console.log('Un client est connecté', socket.id);

    const userId = socket.handshake.query.userId;
    console.log("userId", userId);
    if (userId != "undefined") {
        console.log("je passe dans le user != undifined");
        userSocketMap[userId] = socket.id;

        // Envoi de la liste des utilisateurs connectés
        io.emit('onlineUsers', Object.keys(userSocketMap));
        console.log("userSocketMap", userSocketMap);
        
    }

socket.on("disconnect", () => {
    console.log("Client déconnecté");
    delete userSocketMap[userId];
    io.emit('onlineUsers', Object.keys(userSocketMap));
});
});




module.exports = {app, io, server};