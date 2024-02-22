import React, { useState } from "react";
import { useSocketContext } from '../context/SocketContext';
import { v4 as uuidv4 } from 'uuid';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { useEffect } from "react";
import '../assets/css/Home.css';
import close from '../assets/img/close.png';


function Home({ isConnected }) {
    const { onlineUsers, createRoom, room, user,leaveRoom } = useSocketContext(); // Updated to include createRoom from context
    const [roomId, setRoomId] = useState('');
    const [messages, setMessages] = useState('');
    const [userIsAdmin, setUserIsAdmin] = useState(false);
    const [userData, setUserData] = useState({});
    const [roomClosed, setRoomClosed] = useState(false);

    const navigate = useNavigate();


    useEffect(() => {
        if (user != null ) {
            setUserData(user);
            if (user.userRole === 'admin') {
                setUserIsAdmin(true);
            }
        }
        leaveRoom();
    },[user]);
        
    

    const handleCreateRoom = () => {
        const name = document.querySelector('#nameRoom').value;
        const newUuid = uuidv4();

        if(name !== '')
        { 
            createRoom(name, newUuid);
        }else{
            alert('Veuillez entrer un nom de salle')

        }
    };

    const handleJoinRoom = (roomId) => {
        navigate(`/room/${roomId}`);
    };

    return (
        <div>
            <h1 className="title">Home</h1>
            <p>Utilisateur connecté : {user?.userEmail}</p>

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

            { userIsAdmin ? <div className="divCenter">
                <div className="divCreateRoom">
                    <h2>Créer une salle</h2>
                    <input className="inputDesign" type="text" id="nameRoom" placeholder="Nom de la salle" required />
                    <button onClick={handleCreateRoom}>Créer</button>
                </div>
            </div> : <></>}
                <div className="viewSalle">
                    <p>Salles :</p>
                    <ul className="listRoom">
                        {Object.keys(room).map((key, index) => (
                            <li className="room" key={index}>
                            {room[key].name}
                            {!roomClosed? <button className="border border-blue-300" onClick={() => handleJoinRoom(key)}>Rejoindre</button>:<img src={close}/>}
                            </li>
                        ))}
                    </ul>
                </div>
           
        </div>
    );
}

export default Home;
