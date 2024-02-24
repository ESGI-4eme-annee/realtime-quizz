import { useEffect, useState } from 'react';
import io from 'socket.io-client';
import { useParams } from 'react-router-dom';
import { useSocketContext } from '../../context/SocketContext';

const socket = io('http://localhost:3000');

const Chat = ({ username }) => {
    const { roomId } = useParams();
    const [currentMessage, setCurrentMessage] = useState('');
    const [messageList, setMessageList] = useState([]);
    const { messageChat } = useSocketContext();

    const sendMessage = (event) => {
        event.preventDefault();

        if (socket) {
            if (currentMessage) {
                console.log('username', username);
                const messageData = {
                    roomId: roomId,
                    author: username,
                    message: currentMessage,
                    time: new Date().toLocaleTimeString()
                }
                socket.emit('sendMessage', messageData);
                setCurrentMessage('');
            };
        };
    };


    useEffect(() => {
        console.log('messageChat', messageChat);
        setMessageList((list) => [...list, messageChat]);
    }, [messageChat]);

    return (
        <div>
            {messageList.map((messageContent, index) => {
                return (
                    <div key={index}>
                        <h1>{messageContent.message}</h1>
                        <p>{messageContent.author}</p>
                        <p>{messageContent.time}</p>
                    </div>
                
                );
            })}
            <form onSubmit={sendMessage}>
                <input
                    type="text"
                    value={currentMessage}
                    onChange={(e) => setCurrentMessage(e.target.value)}
                />
                <button type="submit">Send</button>
            </form>
        </div>
    );
};

export default Chat;