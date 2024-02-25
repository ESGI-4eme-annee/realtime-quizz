import React, { useState } from "react";
import { useSocketContext } from '../context/SocketContext';
import { v4 as uuidv4 } from 'uuid';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { useEffect } from "react";
import '../assets/css/Home.css';
import close from '../assets/img/close.png';


function Home({ isConnected }) {
    const { onlineUsers, createRoom, room, user,leaveRoom,handleReloadData,question } = useSocketContext(); // Updated to include createRoom from context
    const [roomId, setRoomId] = useState('');
    const [messages, setMessages] = useState('');
    const [userIsAdmin, setUserIsAdmin] = useState(false);
    const [userData, setUserData] = useState({});
    const [roomClosed, setRoomClosed] = useState(true);
    const [showPassword, setShowPassword] = useState(false);


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

    useEffect(() => {
        handleReloadData();
       
    },[]);
        
    

    const handleCreateRoom = () => {
        const name = document.querySelector('#nameRoom').value;
        const newUuid = uuidv4();
        let password = "";
        if(showPassword){
            password = document.querySelector('#passwordRoom').value;
        }
        if(name !== '')
        { 
            createRoom(name, newUuid, password);
            navigate(`/room/${newUuid}`);
        }else{
            alert('Veuillez entrer un nom de salle')

        }
    };

    const handleJoinRoom = (roomId) => {
        if (room[roomId].password !="") {
            const password = document.querySelector('#testPasswordRoom').value;
            if (password === room[roomId].password) {
                navigate(`/room/${roomId}`);
            } else {
                alert('Mauvais mot de passe');
            }    
        }else
        {
            navigate(`/room/${roomId}`);
        }
    };

    const handleCheckboxChange = () => {
        setShowPassword(!showPassword);
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
                <div className="divCreateRoom bg-base-300 border-solid border-2 border-neutral-content">
                    <h1 className="font-bold text-lg">Créer une salle</h1>
                    <input className="input input-bordered w-full max-w-xs mt-5" type="text" id="nameRoom" placeholder="Nom de la salle" required />
                    {/* <div className="line"><input className="" type="checkbox" id="checkRoom" onChange={handleCheckboxChange} /><p>Ajouter un mdp</p></div> */}
                    <div className="form-control">
                        <label className="label cursor-pointer">
                            <input type="checkbox" id="checkRoom" onChange={handleCheckboxChange}  className="checkbox bg-white" />
                            <span className="label-text m-5">Ajouter un mdp</span> 
                        </label>
                    </div>

                    {showPassword && (
                        <input className="input input-bordered w-full max-w-xs mb-5" type="password" id="passwordRoom" placeholder="Mot de passe" />
                    )}
                    <button onClick={handleCreateRoom} className="btn btn-primary">Créer</button>
                </div>
            </div> : <></>}
            <div className="viewSalleHeight">
                <div className="viewSalle">
                    <p className="text-lg font-bold mb-5">Salles :</p>
                    <ul className="listRoom">
                        {Object.keys(room).map((key, index) => (
                            <li className="room" key={index}>
                            <div className="m-1">{room[key].password? <p className="badge">Privée</p>:<p className="badge">Public</p>}</div>
                            <p className="m-5">{room[key].name}</p>
                            {room[key].password?<input className="input input-bordered w-full max-w-xs mb-3" type="password" id="testPasswordRoom" placeholder="Mot de Passe" />:null}
                            {room[key].state? <button className="btn " onClick={() => handleJoinRoom(key)}>Rejoindre</button>:<img src={close}/>}
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </div>
    );
}

export default Home;
