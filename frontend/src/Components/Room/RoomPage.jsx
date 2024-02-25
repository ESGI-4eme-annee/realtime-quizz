import { useEffect, useState, useRef } from "react";
import { useParams,useNavigate } from 'react-router-dom';
import '../../assets/css/Room.css';

import { useSocketContext } from '../../context/SocketContext';
import CreateQuizz from './CreateQuizz';
import getQuizzList from '../../hook/getQuizzList';
import getQuizz from '../../hook/getQuizz';
import ViewQuizz from "./ViewQuizz";
import ViewQuestion from "./ViewQuestion";
import Chat from "../Chat/Chat";
import ViewUserQuestion from "./ViewUserQuestion";
import Notification from "../Notification/Notification.jsx";
import gold from '../../assets/img/gold.png';
import silver from '../../assets/img/silver.png';
import bronze from '../../assets/img/bronze.png';
import ViewResponseQuizz from "./ViewResponseQuizz.jsx";
import addScore from '../../hook/addScore.js';

function RoomPage({ isLogged }) {

    const { roomId } = useParams();

    const {createRoom,joinRoom,roomUsers,user,sendQuizz,room,scoreQuizz,socket,clientJoin } = useSocketContext();
    const [showQuizzCreate, setShowQuizzCreate] = useState(false);
    const [quizzList, setQuizzList] = useState([]);
    const [quizz, setQuizz] = useState({});
    const [quizzId, setQuizzId] = useState(null);
    const [quizzView, setQuizzView] = useState(false);
    const [userIsAdmin, setUserIsAdmin] = useState(false);
    const [username, setUsername] = useState('');
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
    const [quizzEnd, setQuizzEnd] = useState(false);
    const [quizzResponseForClient, setQuizzResponseForClient] = useState(null);
    const users = useRef([]);
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
        if (user != null) {
            if (user.userRole === 'admin'&& room[roomId]?.userEmail === user.userEmail ) {
                setUserIsAdmin(true);
            }
            setUsername(user.userEmail);
        }
    }, [clientJoin,user,roomId,room]);

    useEffect(() => {
        socket?.on('timerQuestion', (time) => {
            setTimerQuestion(time);
            if (time <= 0) {
                setTimeout(() => {
                    setTimerQuestion(null);
                    if (userIsAdmin) {
                        socket.emit('needNextQuestion', { quizzId: quizz.id, roomId, questionId: nextQuestion.id });
                    }
                }, 3000);
            }
        });

        return () => {
            if (socket) {
                socket.off('timerQuestion');

            }
        }
    }, [userIsAdmin, nextQuestion]);

    useEffect(() => {
        fetchdata();
        joinRoom(roomId);
    }, [user,roomId]);

    function sendScores(users) {
        users.forEach(async (user) => {
            await addScore(user.userId, quizzId, quizz.name, user.score);
        });
    }

    useEffect(() => {
        socket?.on('quizzEnd', () => {
            if(users.current.length > 0 && quizzId && quizz.name) {
                setQuizzEnd(true);
                sendScores(users.current);
                users.current = [];
            }
        });
    }, [users.current]);

    useEffect(() => {
        roomUsers.forEach(user => {
            scoresQuizz.forEach(userScore => {
                if (user.userId === userScore.userId) {
                    user.score = userScore.score;
                }
            });
        });

        users.current = roomUsers;
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

        socket?.on('nextQuestion', ({question, quizzId}) => {
            setNextQuestion(question || null);
            setQuizzId(quizzId);
            setQuizzStarted(true);
            if (question === undefined) {
                setQuizzEnd(true);
                socket.emit('getQuizzResponseForClient', { quizzId, roomId });
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

        socket?.on('quizzResponseForClient', (question) => {
            setQuizzResponseForClient(question);
        });
    }, [socket, roomId, reload]);

    useEffect(() => {
        fetchdata();
    }, [reload, roomId]);

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
        }
        setQuizzProgress(false);
        setViewQuestion(true);
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
        }
    }

    return (
        <div className="p-5">
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
                    <h1 className="my-2">Classement de la salle</h1>
                    <table className="table" id="table">
                    <tbody className="text-primary-content">
                        {roomUsers
                        ?.sort((a, b) => (b.score || 0) - (a.score || 0))
                        .map((user, index) => (
                            <tr className="liClassement bg-primary" key={index}>
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
                    <div className="partAdmin bg-base-300 border-solid border-2 border-neutral-content flex-col gap-4">
                        <div className="createQuizz">
                        <button className="btn" onClick={() => { createQuizz () }}>Créer un quizz</button>
                            <dialog id="my_modal_1" className="modal">
                                <div className="modal-box">
                                <h3 className="font-bold text-lg">Création du Quizz</h3>
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
                        ? <div className="w-80">
                            <h2 className="mb-1">Choisir un quizz</h2>
                            <div className="w-full flex justify-between">
                                <select onFocus={() => setShowQuizzCreate(false)} className="select select-bordered">
                                    <option value="" disabled>Choisissez un quizz</option>
                                    {quizzList.map((quizz, index) => (
                                    <option key={index} value={quizz.id}>
                                        {quizz.name}
                                    </option>
                                    ))}
                                </select>
                                <button className="btn btn-primary" onClick={() => handleConfirmation()}>Confirmer</button>
                                </div>
                        </div>
                        : null
                    }

                    </div>
                </div>
            :null }

            {
                quizzEnd ? <h1 className="text-3xl">Quizz finished</h1> : null
            }

            {
                userIsAdmin && quizzView 
                ? <> 
                    {
                        !quizzStarted && nextQuestion === null
                        ?
                        <button
                            onClick={handleStartQuizz} disabled={!quizzView}
                            className="btn btn-primary">
                                Lancer le quizz
                        </button>
                        : null
                    }
                    {
                        quizzStarted  && nextQuestion !== null
                        ? <>
                            <div>
                                Gestion du temps
                                <button className="btn ml-4" onClick={() => handleTimer(10)} disabled={timerQuestion == null}>
                                    +10s
                                </button>
                                <button className="btn ml-2" onClick={() => handleTimer(-10)} disabled={timerQuestion == null}>
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
                    ? <div className="cote w-2/4 bg-base-300 p-10">
                        <ViewUserQuestion nextQuestion={nextQuestion} quizzId={quizzId} roomId={roomId} timerQuestion={timerQuestion} />
                    </div>
                    : !userIsAdmin && !quizzEnd 
                        ? <div className="text-3xl">L'administrateur va bientôt lancer le quizz...</div> 
                        : null
                }
                {
                    quizzResponseForClient !== null && quizzEnd && !userIsAdmin && nextQuestion === null
                    ? 
                    <div>
                        <h2 className='text-2xl mb-2'>Voici les bonnes réponses de ce quizz :</h2>
                        <ViewResponseQuizz questions={quizzResponseForClient} />
                    </div>
                    : null
                }
                <Chat username={username} nextQuestion={nextQuestion} />
            </div>

            <Notification isVisible={displayNotification} notification={notification} />

        </div>
    );
}

export default RoomPage;
