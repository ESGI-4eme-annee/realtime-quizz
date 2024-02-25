import { useEffect, useState, useRef } from 'react';
import io from 'socket.io-client';
import { useParams } from 'react-router-dom';
import { useSocketContext } from '../../context/SocketContext';
import '../../assets/css/Room.css';

const socket = io('http://localhost:3000');

const Chat = ({ username, nextQuestion }) => {
    const { roomId } = useParams();
    const [currentMessage, setCurrentMessage] = useState('');
    const [messageList, setMessageList] = useState([]);
    const { messageChat, resetMessageChat } = useSocketContext();
    const endOfMessagesRef = useRef(null);
    const [cheatCount, setCheatCount] = useState(0);
    const [isBlocked, setIsBlocked] = useState(false);

    const possibleAnswers = nextQuestion ? nextQuestion.Answers.map(answer => answer.name) : [];

    const sendMessage = (event) => {
        event.preventDefault();

        if (socket) {
            if (currentMessage) {
                const isCheating = nextQuestion && possibleAnswers && possibleAnswers.some(answer => currentMessage.toLowerCase().includes(answer.toLowerCase()));

                if (isCheating) {
                    const newCheatCount = cheatCount + 1;
                    setCheatCount(newCheatCount);
                    if (newCheatCount > 1) {
                        setIsBlocked(true);
                        setTimeout(() => setIsBlocked(false), 5000);
                        setMessageList((list) => [...list, { author: 'System', message: 'Tentative de triche détectée. Vous êtes bloqué du chat pendant 5 secondes.', time: new Date().toLocaleTimeString(), messageType: 'error' }]);
                    } else {
                        setMessageList((list) => [...list, { author: 'System', message: 'Tentative de triche détectée. Votre message n\'a pas été envoyé.', time: new Date().toLocaleTimeString(), messageType: 'warning' }]);
                    }
                    setCurrentMessage('');
                } else {
                    const messageData = {
                        roomId: roomId,
                        author: username,
                        message: currentMessage,
                        time: new Date().toLocaleTimeString()
                    }
                    socket.emit('sendMessage', messageData);
                    setCurrentMessage('');
                }
            };
        };
    };

    const scrollToBottom = () => {
        endOfMessagesRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        socket.emit('joinRoom', roomId);
    
        return () => {
            socket.emit('leaveRoom', roomId);
            resetMessageChat();
        };
    }, [roomId]);

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
        <div className="chat-container">
            {messageList.map((messageContent, index) => {
                const bubbleClass = messageContent.messageType === 'error' ? 'chat-bubble-error' : (messageContent.messageType === 'warning' ? 'chat-bubble-warning' : '');
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
                            <div className={`chat-bubble ${bubbleClass}`}>
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
                    className="input input-bordered w-full max-w-xs"
                    type="text"
                    value={currentMessage}
                    onChange={(e) => setCurrentMessage(e.target.value)}
                    disabled={isBlocked}
                />
                <button type="submit" className="btn">Envoyer</button>
            </form>
        </div>
    );
};

export default Chat;