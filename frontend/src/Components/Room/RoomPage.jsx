import React, { useEffect, useState } from "react";
import { useParams,useNavigate } from 'react-router-dom';
import '../../assets/css/Room.css';

import { useSocketContext } from '../../context/SocketContext';
import CreateQuizz from './CreateQuizz';
import getQuizzList from '../../hook/getQuizzList';
import getQuizz from '../../hook/getQuizz';
import ViewQuizz from "./ViewQuizz";
import ViewQuestion from "./ViewQuestion";
import Notification from "../Notification/Notification.jsx";

function RoomPage({ isLogged }) {

    const { roomId } = useParams();

    const {joinRoom,roomUsers,user,sendQuizz,room,scoreQuizz,socket,clientJoin } = useSocketContext();
    const [showQuizzCreate, setShowQuizzCreate] = useState(false);
    const [quizzList, setQuizzList] = useState([]);
    const [quizz, setQuizz] = useState({});
    const [quizzView, setQuizzView] = useState(false);
    const [userIsAdmin, setUserIsAdmin] = useState(false);
    const [timerBeforeStart, setTimerBeforeStart] = useState(null);
    const [reload, setReload] = useState(false);
    const [quizzProgress, setQuizzProgress] = useState(true);
    const [viewQuestion, setViewQuestion] = useState(false);
    const [displayNotification, setDisplayNotification] = useState(false);
    const [notification, setNotification] = useState({});

    const navigate = useNavigate();


    //liste des quizz dans le select
    const fetchdata = async () => {
        const data = await getQuizzList();
        setQuizzList(data);
    }

    useEffect(() => {
        // if(roomDontExist){
        //     navigate(`/`);
        // }
        fetchdata();
        joinRoom(roomId);
        if (user != null ) {
            if (user.userRole === 'admin'&& room[roomId]?.userEmail === user.userEmail ) {
                setUserIsAdmin(true);
            }
        }
    }, [user,roomId,clientJoin]);

    useEffect(() => {
        socket?.on('timerBeforeStart', (time) => {
            setTimerBeforeStart(time);
            if (time === 0) {
                setTimeout(() => {
                    setTimerBeforeStart(null);
                }, 1000);
            }
        });

        socket?.on('alertQuizzStarting', (data) => {
            setNotification(data);
            setDisplayNotification(true);
            setTimeout(() => {
                setDisplayNotification(false);
            }, 3000);
        });

        socket?.on('alertNextQuestion', (data) => {
            setNotification(data);
            setDisplayNotification(true);
            setTimeout(() => {
                setDisplayNotification(false);
            }, 3000);
        });

        socket?.on('alertQuizzEnd', (data) => {
            setNotification(data);
            setDisplayNotification(true);
            setTimeout(() => {
                setDisplayNotification(false);
            }, 3000);
        });
    }, [socket,roomId,reload]);

    useEffect(() => {
        fetchdata();
    }, [reload,roomId]);

    //affiche le formulaire de création de quizz
    const createQuizz = () => {
        setShowQuizzCreate(!showQuizzCreate);
        document.getElementById('my_modal_1').showModal()
    }

    //choisir un quizz dans le select
    const handleConfirmation =  async () => {
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
        setViewQuestion(true);
        //envoyer le quizz aux clients
    }

    const handleNextQuestion = () => {
        roomUsers.forEach(user => {
            user.score = scoreQuizz[user.userId];
        });
    }

    const beginQuizz = () => {
        socket.emit('startQuizz', roomId);
    }

    return (
        <div>
            <h1 className="text-9xl absolute inset-1/2 font-bold shadow-2xl">
                {timerBeforeStart ? timerBeforeStart : null}
                {timerBeforeStart === 0 ? 'Go' : null}
            </h1>

            <h1>Room</h1>
            <p>Utilisateur connecté : {isLogged ? 'Oui' : 'Non'}</p>

            <div className="right">
                <div className="userOnline">
                    <h2>Utilisateurs dans la salle</h2>
                    <ul className="listUserOnline">
                        {roomUsers?.sort((a, b) => (b.score || 0) - (a.score || 0))
                        .map((user, index) => (
                            <li key={index}>{user.userEmail} score:{user.score || 0}</li>
                        ))}
                    </ul>
                </div>
            </div>

            {
                userIsAdmin
                ? <div className="createQuizz">
                    {/* <button className="buttonCreate" onClick={() => { createQuizz () }}>Cree un quizz</button> */}
                    {/* { showQuizzCreate? <CreateQuizz setShowQuizzCreate={setShowQuizzCreate} setReload={setReload}/> : null} */}
                   <button className="btn" onClick={() => { createQuizz () }}>open modal</button> 
                    <dialog id="my_modal_1" className="modal">
                        <div className="modal-box">
                        <h3 className="font-bold text-lg">Creation du Quizz</h3>
                        { showQuizzCreate?<CreateQuizz setShowQuizzCreate={setShowQuizzCreate} setReload={setReload}/>: null}
                            <div className="modal-action">
                            <form method="dialog">
                                {/* if there is a button in form, it will close the modal */}
                                <button className="btn">Close</button>
                            </form>
                            </div>
                        </div>
                    </dialog>
                </div>
                : null
            }

            {
                userIsAdmin && quizzProgress
                ? <div className="selectQuizz">
                     <h2>Choisir un quizz</h2>
                        <select onFocus={() => setShowQuizzCreate(false)} className="select select-bordered w-full max-w-xs">
                            <option value="" disabled>Choisissez un quizz</option>
                            {quizzList.map((quizz, index) => (
                            <option key={index} value={quizz.id}>
                                {quizz.name}
                            </option>
                            ))}
                        </select>
                        <button className="btn" onClick={() => handleConfirmation()}>Confirmer</button>

                </div>
                : null
            }

            {
                userIsAdmin
                ? <div className="btn btn-active">
                    <button onClick={() => beginQuizz()}>Lancer le quizz</button>
                </div>
                : null
            }

            <div className="viewQuestionQuizz">
                {
                    userIsAdmin
                    ? (quizzView ? <ViewQuizz quizz={quizz}/> : null )
                    : null
                }
                <div className="cote">
                   <ViewQuestion roomId={roomId} handleNextQuestion={handleNextQuestion} />
                   <Notification isVisible={displayNotification} notification={notification} />
                </div>
            </div>
            {userIsAdmin? <div className="lanceQuizz"> 
                <button onClick={handleStartQuizz}>Lancer le quizz</button>
            </div>: null}
                
        </div>
    );
}

export default RoomPage;
