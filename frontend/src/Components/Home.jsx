import React, { useState } from "react";
import { useSocketContext } from '../context/SocketContext';
import { v4 as uuidv4 } from 'uuid';
import { useNavigate, useParams, Link } from 'react-router-dom';
import '../assets/css/Home.css';


function Home({ isConnected }) {
    const { onlineUsers, createRoom, room } = useSocketContext(); // Updated to include createRoom from context
    const [roomId, setRoomId] = useState('');
    const [messages, setMessages] = useState('');

    const navigate = useNavigate();

    const handleCreateRoom = () => {
        const name = document.querySelector('#nameRoom').value;
        const newUuid = uuidv4();

        createRoom(name, newUuid); // Call createRoom from context
    };

    const handleJoinRoom = (roomId) => {
        console.log("join room");
        navigate(`/room/${roomId}`);
    };

    return (
        <div>
            <h1 className="title">Home</h1>
            <p>Utilisateur connecté : {isConnected ? 'Oui' : 'Non'}</p>

            <div className="right">
                <div className="userOnline">
                    <h2>Utilisateurs en ligne</h2>
                    <ul className="listUserOnline">
                        {onlineUsers.map((user, index) => (
                            <li key={index}>{user}</li>
                        ))}
                    </ul>
                </div>
            </div>

            <div className="divCenter">
                <div className="divCreateRoom">
                    <h2>Créer une salle</h2>
                    <input className="inputDesign" type="text" id="nameRoom" placeholder="Nom de la salle" />
                    <button onClick={handleCreateRoom}>Créer</button>
                </div>
                <div>
                    <p>Salles :</p>
                    <ul>
                        {Object.keys(room).map((key, index) => (
                            <li key={index}>
                            {room[key].name}
                            <button className="border border-blue-300" onClick={() => handleJoinRoom(key)}>Rejoindre</button>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </div>
    );
}

export default Home;
