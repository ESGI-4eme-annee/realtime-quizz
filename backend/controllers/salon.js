// controllers/salon.js
let activeRooms = new Map();

function handleConnection(socket) {
    console.log('Un client est connecté');

    socket.on('joinRoom', (roomId) => {
        if (activeRooms.has(roomId)) {
            // Rejoindre le salon existant
            socket.join(roomId);
            console.log(`Le client a rejoint le salon ${roomId}`);
        } else {
            // Créer un nouveau salon
            activeRooms.set(roomId, true);
            socket.join(roomId);
            console.log(`Le client a créé et rejoint le salon ${roomId}`);
        }
    });

    socket.on('createRoom', () => {
        // Ajouter ici la logique pour créer une nouvelle salle si nécessaire
        activeRooms.set(newRoomId, true);
        socket.join(newRoomId);
        console.log(`Le client a créé et rejoint le salon ${newRoomId}`);
    });

    socket.on('disconnect', () => {
        console.log('Client déconnecté');
    });
}

module.exports = { handleConnection };
