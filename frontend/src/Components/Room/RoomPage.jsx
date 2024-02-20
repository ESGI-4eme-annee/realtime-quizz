import React, { useEffect, useState } from "react";
import { useParams } from 'react-router-dom';

import { useSocketContext } from '../../context/SocketContext';
import CreateQuizz from './CreateQuizz';
import getQuizzList from '../../hook/getQuizzList';

function RoomPage({ isLogged }) {

    const { roomId } = useParams();

    const {joinRoom,roomUsers } = useSocketContext();
    const [showQuizzCreate, setShowQuizzCreate] = useState(false);
    const [quizzList, setQuizzList] = useState([]);

    const fetchdata = async () => {
        const data = await getQuizzList();
        setQuizzList(data);
    }
    
    useEffect(() => {
        fetchdata();
        joinRoom(roomId);
    }, []);

    const createQuizz = () => {
        setShowQuizzCreate(!showQuizzCreate);
    }

    const handleChooseQuizz = () => {
        const select = document.querySelector('select');
        const quizzId = select.value;
        console.log(quizzId);
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
                { showQuizzCreate? <CreateQuizz setShowQuizzCreate={setShowQuizzCreate}/> : null}
            </div>
            <div>
                <select>
                    <option value="">Sélectionnez un quizz</option>
                        {quizzList.map((quizz, index) => (
                            <option key={index} value={quizz.id}>
                                {quizz.name}
                            </option>
                        ))}
                </select>
                <button onClick={handleChooseQuizz}>Choisir</button>
            </div>
                
        </div>
    );
}

export default RoomPage;
