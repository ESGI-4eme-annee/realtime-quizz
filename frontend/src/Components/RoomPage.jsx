import React, { useEffect, useState } from "react";
import { useParams } from 'react-router-dom';

import { useSocketContext } from '../context/SocketContext';
import { v4 as uuidv4 } from 'uuid';

function RoomPage({ isLogged }) {

    const { roomId } = useParams();

    const {joinRoom,roomUsers } = useSocketContext();
    
    useEffect(() => {
        joinRoom(roomId);
    }, []);

    const createQuizz = () => {
        console.log("createQuizz");
    }

    return (
        <div>
            <h1>Room</h1>
            <p>Utilisateur connecté : {isLogged ? 'Oui' : 'Non'}</p>

            <div className="right">
                <div className="userOnline">
                    <h2>Utilisateurs dans la salle</h2>
                    <ul className="listUserOnline">
                        {roomUsers?.map((user, index) => (
                            <li key={index}>{user}</li>
                        ))}
                    </ul>
                </div>
            </div>

            <div>
                <button onClick={() => { createQuizz () }}>Cree un quizz</button>
            </div>

        </div>
    );
}

export default RoomPage;
