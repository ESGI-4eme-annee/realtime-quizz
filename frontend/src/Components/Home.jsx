// Components/Home.js
import React, { useEffect, useState } from "react";
import io from "socket.io-client";
import  {useSocketContext} from '../context/SocketContext';

function Home({isConnected}) {

    const {onlineUsers} = useSocketContext;

    const [roomId, setRoomId] = useState('');
    const [messages, setMessages] = useState([]);

    console.log("context", onlineUsers);

    return (
        <div>
            <h1>Home</h1>
            <p>Socket connected: {isConnected ? 'Yes' : 'No'}</p>
            <p>{onlineUsers}</p>


        </div>
    );
}

export default Home;
