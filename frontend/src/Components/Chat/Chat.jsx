import { useEffect, useState, useRef } from 'react';
import io from 'socket.io-client';
import { useParams } from 'react-router-dom';
import { useSocketContext } from '../../context/SocketContext';
import '../../assets/css/Room.css';

const socket = io('http://localhost:3000');

const Chat = ({ username }) => {
    const { roomId } = useParams();
    const [currentMessage, setCurrentMessage] = useState('');
    const [messageList, setMessageList] = useState([]);
    const { messageChat } = useSocketContext();
    const endOfMessagesRef = useRef(null);

    const sendMessage = (event) => {
        event.preventDefault();

        if (socket) {
            if (currentMessage) {
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

    const scrollToBottom = () => {
        endOfMessagesRef.current?.scrollIntoView({ behavior: "smooth" });
    };


    useEffect(() => {
        if (messageChat.message)
        {
            setMessageList((list) => [...list, messageChat]);
        }
    }, [messageChat]);

    useEffect(() => {
        scrollToBottom();
    }, [messageList]);

    return (
        <div className="chat-container bg-base-300 border-solid border-2 border-neutral-content p-4">
            {messageList.map((messageContent, index) => {
                if (messageContent.author === username) {
                    return (
                        <div className="chat chat-end" key={index}>
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
                        <div className="chat chat-start" key={index}>
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
            <div ref={endOfMessagesRef} />
            <form onSubmit={sendMessage} className='chat-form'>
                <input
                    className="input w-full"
                    type="text"
                    value={currentMessage}
                    onChange={(e) => setCurrentMessage(e.target.value)}
                />
                <button type="submit" className="btn btn-primary">Envoyer</button>
            </form>
        </div>
    );
};

export default Chat;