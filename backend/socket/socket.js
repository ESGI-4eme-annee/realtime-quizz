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


io.on('connection', (socket) => {
    console.log('Un client est connecté', socket.id);


    //socket.on() is used to listen for a specific event, and socket.emit() is used to send an event to the client.
socket.on("disconnect", () => {
    console.log("Client déconnecté");
});
});




module.exports = {app, io, server};