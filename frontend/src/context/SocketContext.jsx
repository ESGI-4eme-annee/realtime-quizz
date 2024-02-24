import { createContext, useState, useEffect, useContext } from 'react';
import { io } from 'socket.io-client';
import { accountService } from "../services/account.service";


export const SocketContext = createContext();

export const useSocketContext = () => {
    return useContext(SocketContext);
}

export const SocketContextProvider = ({ children }) => {
    const [socket, setSocket] = useState(null);
    const [userId, setUserId] = useState(null);
    const [userEmail, setUserEmail] = useState(null);
    const [user,setUser] = useState(null);
    const [onlineUsers, setOnlineUsers] = useState([]);
    const [room, setRoom] = useState({});
    const [roomUsers, setRoomUsers] = useState([]);
    const [question, setQuestion] = useState({});
    const [responseCounts, setResponseCounts] = useState({});
    const [responseValid, setResponseValid] = useState(null);
    const [scoreQuizz, setScoreQuizz] = useState([]);
    const [reloadData, setReloadData] = useState(false);
    const [clientJoin, setClientJoin] = useState(false);
    const [roomDontExist, setRoomDontExist] = useState(false);

    const fetchdata = async () => {
        try {
            if (localStorage.getItem("token")) {
                const data =  accountService.getValuesToken();
                if (data != null) {
                    setUserId(data.userId);
                    setUser(data);
                    setUserEmail(data.userEmail);
                }
            } else {
                console.log("Token not found in localStorage");
            }
        } catch (error) {
            console.error("Error fetching data:", error);
        }
    };
    
    useEffect(() => {
        fetchdata();
        if (userId != null) {
            const socket = io("http://localhost:3000", {
                withCredentials: true ,
                query: {
                    userId: userId,
                    userEmail: user.userEmail,
                    userRile: user.userRole
                }
            });
            setSocket(socket);
            socket.on('onlineUsers', (users) => {
                setOnlineUsers(users);
            });
            return () => {
                socket.close();
            };
        
        }else{
            if(socket){
                socket.close();
                setSocket(null);
            }
        }
    }, [userId,reloadData]);

    const handleReloadData = () => {
        fetchdata()
    }

    useEffect(() => {
        if (socket) {
            socket.on('roomCreated', (room) => {
                setRoom(room);
            });
            socket.on('userJoinedRoom', (userEmail) => {
                console.log(`Le client ${userEmail} a rejoint le salon`);
                setClientJoin(userEmail);
            });
            socket.on('roomUsers', (roomUserMap) => {
                setRoomUsers(roomUserMap);
            });
            socket.on('question', (question) => {
                setQuestion(question);
            });
            socket.on('responseCounts', (responseCounts) => {
                setResponseCounts(responseCounts);
            });
            socket.on('responseValid', (responseValid) => {
                setResponseValid(responseValid);
            });
            socket.on('scoreQuizz', (scoreQuizz) => {
                setScoreQuizz(scoreQuizz);
            });
            
        }

    }, [socket]); 


    //ROOM create
    const createRoom = (name, id,password) => {
        socket.emit('createRoom', {
            roomName: name,
            roomId: id,
            userEmail: userEmail,
            password: password
        });
        return room;
    };

    //ROOM join
    const joinRoom = (roomId) => {
        if (socket) {
            socket.emit('joinRoom', {
                roomId: roomId,
                userEmail: userEmail,
                userId: userId
            });
        }
    };

    //ROOM leave
    const leaveRoom = () => {
        if (socket) {
            socket.emit('leaveRoom', {
                userEmail: userEmail,
            });
        }
    };

    //Quizz lancer le quizz
    const sendQuizz = (quizz,salle ) => {
        if (socket) {
            socket.emit('sendQuizz', {
                quizz: quizz,
                salle: salle
            });
        };
    }

    //Qizz question clique
    const sendResponse = (salle,idQuizz,idQuestion,idResponse,timer) => {
        if (socket) {
            socket.emit('sendResponse',userId, salle,idQuizz,idQuestion,idResponse,timer);
        };
    }

    return (
        <SocketContext.Provider value={
            {
                socket,
                onlineUsers,
                handleReloadData,
                createRoom,
                room,
                joinRoom,
                user,
                roomUsers,
                sendQuizz,
                question,
                sendResponse,
                responseCounts,
                responseValid,
                leaveRoom,
                scoreQuizz,
                clientJoin,
                roomDontExist
            }}>
            {children}
        </SocketContext.Provider>
    );
};
