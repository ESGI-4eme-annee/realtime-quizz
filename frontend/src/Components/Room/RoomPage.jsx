import React, { useEffect, useState } from "react";
import { useParams } from 'react-router-dom';
import '../../assets/css/Room.css';

import { useSocketContext } from '../../context/SocketContext';
import CreateQuizz from './CreateQuizz';
import getQuizzList from '../../hook/getQuizzList';
import getQuizz from '../../hook/getQuizz';
import ViewQuizz from "./ViewQuizz";
import ViewUserQuestion from "./ViewUserQuestion";

function RoomPage({ isLogged }) {

    const { roomId } = useParams();

    const {joinRoom,roomUsers,user,room,scoreQuizz,socket } = useSocketContext();
    const [showQuizzCreate, setShowQuizzCreate] = useState(false);
    const [quizzList, setQuizzList] = useState([]);
    const [quizz, setQuizz] = useState({});
    const [quizzView, setQuizzView] = useState(false);
    const [userIsAdmin, setUserIsAdmin] = useState(false);
    const [timerBeforeStart, setTimerBeforeStart] = useState(null);
    const [timerQuestion, setTimerQuestion] = useState(null);
    const [reload, setReload] = useState(false);
    const [quizzProgress, setQuizzProgress] = useState(true);
    const [viewQuestion, setViewQuestion] = useState(false);

    const [nextQuestion, setNextQuestion] = useState(null);
    const [disabledButtonStartQuizz, setDisabledButtonStartQuizz] = useState(true);


    //liste des quizz dans le select
    const fetchdata = async () => {
        const data = await getQuizzList();
        setQuizzList(data);
    }
    
    useEffect(() => {
        fetchdata();
        joinRoom(roomId);
        if (user != null ) {
            if (user.userRole === 'admin'&& room[roomId].userEmail === user.userEmail ) {
                setUserIsAdmin(true);
            }
        }
    }, [user]);

    useEffect(() => {
        joinRoom(roomId);
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

        socket.on('nextQuestion', (nextQuestion) => {
            setNextQuestion(nextQuestion);
            console.log('nextQuestion', nextQuestion);
        });

        socket?.on('timerQuestion', (time) => {
            setTimerQuestion(time);
            console.log(time);
            if (time === 0) {
                setTimeout(() => {
                    setTimerQuestion(null);
                }, 3000);
            }
        });
    }, [socket,roomId]);

    useEffect(() => {
        fetchdata();
    }, [reload,roomId]);

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
        
        if (socket) {
            socket.emit('startQuizz', { quizz, salle: roomId });
        };

        setQuizzProgress(false);
        setViewQuestion(true);
        //envoyer le quizz aux clients
    }

    const handleNextQuestion = () => {
        roomUsers.forEach(user => {
            user.score = scoreQuizz[user.userId];
        });
    }

    const clickNextQuestion = () => {
        socket.emit('needNextQuestion', { quizzId: quizz.id, roomId, questionId: nextQuestion.id });
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
                            {timerQuestion ? timerQuestion : null}
                            {timerQuestion === 0 ? 'Fin du temps' : null}
                        </span>
                    </div>
                </div>
                : null
            }

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
                    <button className="buttonCreate" onClick={() => { createQuizz () }}>Cree un quizz</button>
                    { showQuizzCreate? <CreateQuizz setShowQuizzCreate={setShowQuizzCreate} setReload={setReload}/> : null}
                </div>
                : null
            }

            {
                userIsAdmin && quizzProgress
                ? <div className="selectQuizz">
                    <h2>Choisir un quizz</h2>
                    <select onFocus={() => setShowQuizzCreate(false)} onChange={(event) => {
                            setDisabledButtonStartQuizz(false);
                            handleChooseQuizz(event.target.value)
                        }}
                        className="select select-bordered w-full max-w-xs">
                            {quizzList.map((quizz, index) => (
                                <option key={index} value={quizz.id}>
                                    {quizz.name}
                                </option>
                            ))}
                    </select>
                </div>
                : null
            }
            
            {
                userIsAdmin 
                ? <> 
                    <button 
                        onClick={handleStartQuizz} disabled={disabledButtonStartQuizz}
                        className="btn">
                            Lancer le quizz
                    </button>
                    <button className="btn" onClick={clickNextQuestion} disabled={disabledButtonStartQuizz}>
                        Next Question
                    </button>
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
                        <ViewUserQuestion nextQuestion={nextQuestion} roomId={roomId} handleNextQuestion={handleNextQuestion} />
                    </div>
                    : null
                }
            </div>
        </div>
    );
}

export default RoomPage;
