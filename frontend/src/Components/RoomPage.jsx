import React, { useEffect, useState } from "react";
import { useParams } from 'react-router-dom';

import { useSocketContext } from '../context/SocketContext';
import { v4 as uuidv4 } from 'uuid';

function RoomPage({ isLogged }) {

    const { roomId } = useParams();
    console.log(roomId);

    const {joinRoom } = useSocketContext();
    
    useEffect(() => {
        joinRoom(roomId);
    }, []);

    return (
        <div>
            <h1>Room</h1>
            <p>Utilisateur connecté : {isLogged ? 'Oui' : 'Non'}</p>
        </div>
    );
}

export default RoomPage;
