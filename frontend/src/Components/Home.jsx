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
    },[user,isConnected]);
        
    

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
        <div className="p-5">
            <div className="text-end font-semibold">
                {
                    isConnected
                    ? <div className="badge badge-primary mb-4 p-3">Connecté</div>
                    : <div className="badge badge-ghost mb-4 p-3">Non connecté</div>
                }
            </div>
            {
                isConnected &&
                <div className="drawer drawer-end">
                    <input id="my-drawer" type="checkbox" className="drawer-toggle" />
                    <div className="drawer-content flex justify-end">
                        {/* Page content here */}
                        <label htmlFor="my-drawer" className="drawer-button btn btn-sm">Utilisateurs connecté</label>
                    </div>
                    <div className="drawer-side">
                        <label htmlFor="my-drawer" aria-label="close sidebar" className="drawer-overlay"></label>
                        <ul className="menu p-4 w-96 min-h-full bg-base-200 text-base-content">
                            <h2 className="text-2xl max-w-64 text-center mx-auto">Identifiants des utilisateurs connectés</h2>
                            <ul className="listUserOnline text-center my-6 font-semibold">
                                {
                                    onlineUsers.length === 0
                                    ? <li>Aucun utilisateur connecté</li>
                                    : onlineUsers.map((user, index) => (
                                        <li key={index}>{user}</li>
                                    ))
                                }
                            </ul>
                        </ul>
                    </div>
                </div>
            }

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
