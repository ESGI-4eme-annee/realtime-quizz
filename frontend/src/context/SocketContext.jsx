import { createContext, useState, useEffect } from 'react';
import { io } from 'socket.io-client';

export const SocketContext = createContext();

export const SocketContextProvider = ({ children }) => {

    const [socket, setSocket] = useState(null);
    const [onlineUsers, setOnlineUsers] = useState([]);
    
    //mettre la verification que l'utilisateur est connecter 
    useEffect(() => {
       const socket = io("http://localhost:3000", { withCredentials: true });

       setSocket(socket);

       return () => {
           socket.close();
       };
    }, []);

    return (
        <SocketContext.Provider value={{socket}}>
            {children}
        </SocketContext.Provider>
    );
};
