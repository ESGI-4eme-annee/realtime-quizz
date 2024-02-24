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
                // setMessageList((list) => [...list, messageData]);
                console.log('messageData ENVOIE', messageData);
                setCurrentMessage('');
            };
        };
    };


    useEffect(() => {
        if (messageChat.message)
        {
            setMessageList((list) => [...list, messageChat]);
        }
        // setMessageList((list) => [...list, messageChat]);
    }, [messageChat]);

    return (
        <div className="flex min-h-screen flex-col justify-between p-12">
            {messageList.map((messageContent, index) => {
                if (messageContent.author === username) {
                    return (
                        <div className="chat chat-end"  key={index}>
                            <div className="chat-header">{messageContent.author}</div>
                            <div className="chat-bubble chat-bubble-primary">
                                {messageContent.message}
                            </div>
                            <div className="chat-footer opacity-50">
                            <time className="text-xs opacity-50">{messageContent.time}</time>
                            </div>
                        </div>
                    
                    );
                } else {
                    return (
                        <div className="chat chat-start"  key={index}>
                            <div className="chat-header">{messageContent.author}</div>
                            <div className="chat-bubble">
                                {messageContent.message}
                            </div>
                            <div className="chat-footer opacity-50">
                            <time className="text-xs opacity-50">{messageContent.time}</time>
                            </div>
                        </div>
                    
                    );
                }
            })}
            <form onSubmit={sendMessage}>
                <input
                    className="input"
                    type="text"
                    value={currentMessage}
                    onChange={(e) => setCurrentMessage(e.target.value)}
                />
                <button type="submit" className="btn">Envoyer</button>
            </form>
        </div>
    );
};

export default Chat;