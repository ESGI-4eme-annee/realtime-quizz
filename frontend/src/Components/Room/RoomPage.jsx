import React, { useEffect, useState } from "react";
import { useParams } from 'react-router-dom';
import '../../assets/css/Room.css';

import { useSocketContext } from '../../context/SocketContext';
import CreateQuizz from './CreateQuizz';
import getQuizzList from '../../hook/getQuizzList';
import getQuizz from '../../hook/getQuizz';
import ViewQuizz from "./ViewQuizz";
import ViewQuestion from "./ViewQuestion";

function RoomPage({ isLogged }) {

    const { roomId } = useParams();

    const {joinRoom,roomUsers,user } = useSocketContext();
    const [showQuizzCreate, setShowQuizzCreate] = useState(false);
    const [quizzList, setQuizzList] = useState([]);
    const [quizz, setQuizz] = useState({});
    const [quizzView, setQuizzView] = useState(false);
    const [userIsAdmin, setUserIsAdmin] = useState(false);

    const fetchdata = async () => {
        const data = await getQuizzList();
        setQuizzList(data);
    }
    
    useEffect(() => {
        fetchdata();
        joinRoom(roomId);
        if (user != null ) {
            if (user.userRole === 'admin') {
                setUserIsAdmin(true);
            }
        }
    }, [user]);

    const createQuizz = () => {
        setShowQuizzCreate(!showQuizzCreate);
    }

    const handleChooseQuizz =  async () => {
        const select = document.querySelector('select');
        const quizzId = select.value;
        const thequizz = await getQuizz(quizzId);
        setQuizz(thequizz);
        setQuizzView(true);
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

            {userIsAdmin?<div className="createQuizz">
                <button className="buttonCreate" onClick={() => { createQuizz () }}>Cree un quizz</button>
                { showQuizzCreate? <CreateQuizz setShowQuizzCreate={setShowQuizzCreate}/> : null}
            </div>: null}

              {userIsAdmin?<div className="selectQuizz">
                <div className="selectText">
                <select>
                    <option value="">Sélectionnez un quizz</option>
                        {quizzList.map((quizz, index) => (
                            <option key={index} value={quizz.id}>
                                {quizz.name}
                            </option>
                        ))}
                </select>
                </div>
                <div className="selectText">
                <button onClick={handleChooseQuizz}>Choisir</button>
                </div>
            </div>: null}
            <div className="viewQuestionQuizz">
                { 
                    userIsAdmin 
                    ? (quizzView ? <ViewQuizz quizz={quizz}/> : null )
                    : null
                }
                <div className="cote">
                    <ViewQuestion />
                </div>
            </div>
            {
                userIsAdmin 
                ? <div className="lanceQuizz"> 
                    <button onClick={() => { }}>Lancer le quizz</button>
                </div>
                : null
            }
        </div>
    );
}

export default RoomPage;
