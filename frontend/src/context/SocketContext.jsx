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
    const [user,setUser] = useState(null);
    const [onlineUsers, setOnlineUsers] = useState([]);
    const [room, setRoom] = useState({});
    const [roomUsers, setRoomUsers] = useState([]);


    const fetchdata = async () => {
        try {
            if (localStorage.getItem("token")) {
                const data =  accountService.getValuesToken();
                if (data != null) {
                    setUserId(data.userId);
                    setUser(data);
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
    }, [userId]);

    //ROOM create
    const createRoom = (name, id) => {
        socket.emit('createRoom', {
            roomName: name,
            roomId: id,
            userId: userId
        });
        return room;
    };

    useEffect(() => {
        if (socket) {
            socket.on('roomCreated', (room) => {
                setRoom(room);
            });
            socket.on('userJoinedRoom', (userId) => {
                console.log(`Le client ${userId} a rejoint le salon`);
            });
            socket.on('roomUsers', (roomUserMap) => {
                setRoomUsers(roomUserMap);
            });
        }

    }, [socket]); 


    //ROOM join
    const joinRoom = (roomId) => {
        if (socket) {
            socket.emit('joinRoom', {
                roomId: roomId,
                userId: userId
            });
        }
    };





    return (
        <SocketContext.Provider value={
            {
                socket,
                onlineUsers,
                createRoom,
                room,
                joinRoom,
                user,
                roomUsers
            }}>
            {children}
        </SocketContext.Provider>
    );
};
