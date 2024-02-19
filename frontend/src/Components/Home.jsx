// Components/Home.js
import React, { useEffect, useState } from "react";
import io from "socket.io-client";

const socket = io('http://localhost:3001');

function Home() {
    const [roomId, setRoomId] = useState('');
    const [messages, setMessages] = useState([]);
    const [isConnected, setIsConnected] = useState(false);

    useEffect(() => {
        // Gérer la réception des messages depuis le serveur
        socket.on('message', (message) => {
            setMessages((prevMessages) => [...prevMessages, message]);
        });

        // Gérer la connexion au salon
        socket.on('connect', () => {
            setIsConnected(true);
        });

        // Gérer la déconnexion du salon
        socket.on('disconnect', () => {
            setIsConnected(false);
        });

        return () => {
            // Nettoyage des listeners lors du démontage du composant
            socket.off('message');
            socket.off('connect');
            socket.off('disconnect');
        };
    }, []);

    const joinRoom = () => {
        // Émettre un événement au serveur pour rejoindre un salon
        socket.emit('joinRoom', roomId);
    };

    const createRoom = () => {
        // Émettre un événement au serveur pour créer un salon
        socket.emit('createRoom');
    };

    const sendMessage = (message) => {
        // Émettre un événement au serveur pour envoyer un message
        socket.emit('message', { roomId, message });
    };

    return (
        <div>
            <label>
                ID du salon:
                <input className="bg-gray-200 p-2 rounded-lg w-full" type="text" value={roomId} onChange={(e) => setRoomId(e.target.value)} />
            </label>
            <button onClick={joinRoom} disabled={isConnected}>
                {isConnected ? 'Connecté au salon' : 'Rejoindre le salon'}
            </button>

            <div>
                <h2>Messages</h2>
                <ul>
                    {messages.map((message, index) => (
                        <li key={index}>{message}</li>
                    ))}
                </ul>
                <input className="bg-gray-200 p-2 rounded-lg w-full"
                    type="text"
                    placeholder="Tapez votre message"
                    onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                            sendMessage(e.target.value);
                            e.target.value = '';
                        }
                    }}
                />
            </div>
            <div>
                <button onClick={createRoom} disabled={isConnected}>
                    {isConnected ? 'Connecté au salon' : 'Créer un nouveau salon'}
                </button>
            </div>
        </div>
    );
}

export default Home;
