import React, { useEffect, useState } from "react";
import { useParams,useNavigate } from 'react-router-dom';
import '../../assets/css/Room.css';

import { useSocketContext } from '../../context/SocketContext';
import CreateQuizz from './CreateQuizz';
import getQuizzList from '../../hook/getQuizzList';
import getQuizz from '../../hook/getQuizz';
import ViewQuizz from "./ViewQuizz";
import ViewQuestion from "./ViewQuestion";
import ViewUserQuestion from "./ViewUserQuestion";
import Notification from "../Notification/Notification.jsx";
import gold from '../../assets/img/gold.png';
import silver from '../../assets/img/silver.png';
import bronze from '../../assets/img/bronze.png';


function RoomPage({ isLogged }) {

    const { roomId } = useParams();

    const {createRoom,joinRoom,roomUsers,user,sendQuizz,room,scoreQuizz,socket,clientJoin } = useSocketContext();
    const [showQuizzCreate, setShowQuizzCreate] = useState(false);
    const [quizzList, setQuizzList] = useState([]);
    const [quizz, setQuizz] = useState({});
    const [quizzId, setQuizzId] = useState(null);
    const [quizzView, setQuizzView] = useState(false);
    const [userIsAdmin, setUserIsAdmin] = useState(false);
    const [timerBeforeStart, setTimerBeforeStart] = useState(null);
    const [timerQuestion, setTimerQuestion] = useState(null);
    const [reload, setReload] = useState(false);
    const [quizzProgress, setQuizzProgress] = useState(true);
    const [viewQuestion, setViewQuestion] = useState(false);
    const [displayNotification, setDisplayNotification] = useState(false);
    const [notification, setNotification] = useState({});
    const [scoresQuizz, setScoresQuizz] = useState([]);
    const [nextQuestion, setNextQuestion] = useState(null);
    const [quizzStarted, setQuizzStarted] = useState(false);
    const navigate = useNavigate();

    //liste des quizz dans le select
    const fetchdata = async () => {
        const data = await getQuizzList();
        setQuizzList(data);
    }

        socket?.on('adminLeave', (state) => {
                if(state){
                    navigate('/');
                }
        });
  
    
    useEffect(() => {
        if (user != null ) {
            if (user.userRole === 'admin'&& room[roomId]?.userEmail === user.userEmail ) {
                setUserIsAdmin(true);
            }
        }
    }, [clientJoin,user,roomId]);

    useEffect(() => {
        fetchdata();
        joinRoom(roomId);
    }, [user,roomId]);

    useEffect(() => {
        roomUsers.forEach(user => {
            scoresQuizz.forEach(userScore => {
                if (user.userId === userScore.userId) {
                    user.score = userScore.score;
                }
            });
        });

    },[scoreQuizz,scoresQuizz]);

    useEffect(() => {
        socket?.on('timerBeforeStart', (time) => {
            document.getElementById('modal-timer-before-quizz').showModal();
            setTimerBeforeStart(time);
            if (time === 0) {
                setTimeout(() => {
                    document.getElementById('modal-timer-before-quizz').close();
                    setTimerBeforeStart(null);
                }, 1000);
            }
        });

        socket.on('nextQuestion', ({question, quizzId}) => {
            setNextQuestion(question || null);
            setQuizzId(quizzId);
        });

        socket?.on('timerQuestion', (time) => {
            setTimerQuestion(time);
            if (time <= 0) {
                setTimeout(() => {
                    setTimerQuestion(null);
                }, 3000);
            }
        });

        socket?.on('scoresQuizz', (scores) => {
            setScoresQuizz(scores);
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

        socket?.on('alertQuestionWillEnd', (data) => {
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
        if (socket) {
            socket.emit('startQuizz', { quizz, salle: roomId });
        };
        setQuizzProgress(false);
        setViewQuestion(true);
        setQuizzStarted(true);
    }

    const clickNextQuestion = () => {
        if(nextQuestion !== null){
            socket.emit('needNextQuestion', { quizzId: quizz.id, roomId, questionId: nextQuestion.id });
        }
    }

    const closeModale = (state) => {
        if(state){
            document.getElementById('my_modal_1').close();
        }
    }

    // handle timer during the quizz, add or remove time from the current timer
    const handleTimer = (time) => {
        if (socket) {
            socket.emit('handleTimer', { time, quizzId: quizz.id, roomId });
        };
    }

    return (
        <div>
            <dialog id="modal-timer-before-quizz" className="modal">
                <div className="modal-box py-32">
                    <h1 className="text-9xl font-bold mx-auto w-auto text-center">
                        {timerBeforeStart ? timerBeforeStart : null}
                        {timerBeforeStart === 0 ? 'Go' : null}
                    </h1>
                </div>
            </dialog>

            {
                timerQuestion !== null
                ? <div className="toast toast-top toast-end">
                    <div className="alert alert-info flex justify-center w-auto">
                        <span className="text-2xl font-semibold text-white">
                            {timerQuestion > 0 ? timerQuestion : null}
                            {timerQuestion <= 0 ? 'Fin du temps' : null}
                        </span>
                    </div>
                </div>
                : null
            }

            {/* <h1>Room</h1>
            <p>Utilisateur connecté : {isLogged ? 'Oui' : 'Non'}</p> */}

            <div className="right">
                <div className="userOnline">
                    <h1>Classement de la salle</h1>
                    <table className="table" id="table">
                    <tbody>
                        {roomUsers
                        ?.sort((a, b) => (b.score || 0) - (a.score || 0))
                        .map((user, index) => (
                            <tr className="liClassement border-2 border-solid border-black" key={index}>
                            <th>{index === 0 ? <img src={gold} alt="Gold Medal" /> : 
                                index === 1 ? <img src={silver} alt="Silver Medal" /> :
                                index === 2 ? <img src={bronze} alt="bronze Medal" /> : index+1}
                            </th>
                            <th> {user.userEmail} </th>
                            <th> Score : {user.score || 0} </th>
                            </tr>
                        ))}
                    </tbody>
                    </table>
                </div>
            </div>

            
            {
                userIsAdmin
                ? 
                <div className="allAdmin">
                    <div className="partAdmin">
                        <div className="createQuizz">
                        <button className="btn" onClick={() => { createQuizz () }}>Cree un quizz</button> 
                            <dialog id="my_modal_1" className="modal">
                                <div className="modal-box">
                                <h3 className="font-bold text-lg">Creation du Quizz</h3>
                                { showQuizzCreate?<CreateQuizz setShowQuizzCreate={setShowQuizzCreate} setReload={setReload} closeModale={closeModale} />: null}
                                    <div className="modal-action">
                                    <form method="dialog">
                                        <button className="btn" onClick={() => setShowQuizzCreate(!showQuizzCreate)} >Close</button>
                                    </form>
                                    </div>
                                </div>
                            </dialog>
                        </div>
                    {
                        quizzProgress
                        ? <div className="selectQuizz">
                            <h2 className="text-white">Choisir un quizz</h2>
                            <div className="flex flex-row">
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
                        </div>
                        : null
                    }
            
                    </div>
                </div>
            :null }

            {
                userIsAdmin && quizzView 
                ? <> 
                    {
                        !quizzStarted && nextQuestion === null
                        ?
                        <button 
                            onClick={handleStartQuizz} disabled={!quizzView}
                            className="btn">
                                Lancer le quizz
                        </button>
                        : null
                    }
                    {
                        quizzStarted  && nextQuestion !== null
                        ? <>
                            <button className="btn" onClick={clickNextQuestion} disabled={timerQuestion != null}>
                                Next Question
                            </button>
                            <div>
                                Gestion du temps
                                <button className="btn" onClick={() => handleTimer(10)} disabled={timerQuestion == null}>
                                    +10s
                                </button>
                                <button className="btn" onClick={() => handleTimer(-10)} disabled={timerQuestion == null}>
                                    -10s
                                </button>
                            </div>
                        </>
                        : null
                    }
                </>
                : null
            }

            <div className="viewQuestionQuizz">
                {
                    userIsAdmin
                    ? (quizzView ? <ViewQuizz quizz={quizz}/> : null )
                    : null
                }
                {
                    nextQuestion !== null
                    ? <div className="cote">
                        <ViewUserQuestion nextQuestion={nextQuestion} quizzId={quizzId} roomId={roomId} timerQuestion={timerQuestion} />
                        <Notification isVisible={displayNotification} notification={notification} />
                    </div>
                    : null
                }
            </div>
                
        </div>
    );
}

export default RoomPage;
