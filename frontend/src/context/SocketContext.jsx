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
    const [onlineUsers, setOnlineUsers] = useState([]);


    const fetchdata = async () => {
        try {
            if (localStorage.getItem("token")) {
                const data =  accountService.getValuesToken();
                console.log("context", data.userId);
                if (data != null) {
                    console.log("data.userId", data.userId);
                    setUserId(data.userId);
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
        console.log("userId sockete", userId);
        if (userId != null) {
            const socket = io("http://localhost:3000", {
                withCredentials: true ,
                query: {
                    userId: userId
                }
            });
            

            setSocket(socket);

            socket.on('getOnlineUsers', (users) => {
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

    return (
        <SocketContext.Provider value={{socket,onlineUsers}}>
            {children}
        </SocketContext.Provider>
    );
};
