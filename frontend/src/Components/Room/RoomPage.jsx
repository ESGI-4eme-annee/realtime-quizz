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

    const {joinRoom,roomUsers,user,sendQuizz } = useSocketContext();
    const [showQuizzCreate, setShowQuizzCreate] = useState(false);
    const [quizzList, setQuizzList] = useState([]);
    const [quizz, setQuizz] = useState({});
    const [quizzView, setQuizzView] = useState(false);
    const [userIsAdmin, setUserIsAdmin] = useState(false);
    const [reload, setReload] = useState(false);
    const [quizzProgress, setQuizzProgress] = useState(true);

    //liste des quizz dans le select
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

    useEffect(() => {
        fetchdata();
    }, [reload]);

    //affiche le formulaire de création de quizz
    const createQuizz = () => {
        setShowQuizzCreate(!showQuizzCreate);
    }

    //choisir un quizz dans le select
    const handleChooseQuizz =  async () => {
        const select = document.querySelector('select');
        const quizzId = select.value;
        const thequizz = await getQuizz(quizzId);
        setQuizz(thequizz);
        setQuizzView(true);
    }

    const handleStartQuizz = () => {
        console.log('Lancement du quizz');
        sendQuizz(quizz, roomId);
        setQuizzProgress(false);    
        //envoyer le quizz aux clients
       


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

            
            {userIsAdmin && quizzProgress?<div className="createQuizz">
                <button className="buttonCreate" onClick={() => { createQuizz () }}>Cree un quizz</button>
                { showQuizzCreate? <CreateQuizz setShowQuizzCreate={setShowQuizzCreate} setReload={setReload} reload={reload} /> : null}
            </div>: null}

              {userIsAdmin && quizzProgress?<div className="selectQuizz">
                <div className="selectText">
                <select onFocus={() => setShowQuizzCreate(false)}>
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
                {userIsAdmin? <div className="cote">
                    {quizzView ? <ViewQuizz quizz={quizz}/> : null }
                </div>: null}
                <div className="cote">
                    <ViewQuestion roomId={roomId} />
                </div>
            </div>
            {userIsAdmin? <div className="lanceQuizz"> 
                <button onClick={handleStartQuizz}>Lancer le quizz</button>
            </div>: null}
                
        </div>
    );
}

export default RoomPage;
