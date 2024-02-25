import { useEffect, useState, useRef } from 'react';
import io from 'socket.io-client';
import { useParams } from 'react-router-dom';
import { useSocketContext } from '../../context/SocketContext';

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
    const keywords = [
        "1",
        "2",
        "3",
        "première",
        "deuxième",
        "troisième",
        "première réponse",
        "deuxième réponse",
        "troisième réponse",
        "réponse 1",
        "réponse 2",
        "réponse 3",
        "1ère",
        "2ème",
        "3ème",
        "1re",
        "2e",
        "3e",
        "premier choix",
        "deuxième choix",
        "troisième choix",
        "option 1",
        "option 2",
        "option 3",
        "alternative 1",
        "alternative 2",
        "alternative 3",
        "choix 1",
        "choix 2",
        "choix 3",
        "un",
        "deux",
        "trois",
        "premier",
        "deuxième",
        "troisième"
    ];

    const sendMessage = (event) => {
        event.preventDefault();

        if (socket) {
            if (currentMessage) {
                const isCheating = nextQuestion && (possibleAnswers.some(answer => currentMessage.toLowerCase().replace(/\s/g, '').includes(answer.toLowerCase())) || keywords.some(keyword => currentMessage.toLowerCase().replace(/\s/g, '').includes(keyword)));

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
        <div className="chat-container flex flex-col fixed bottom-0 right-0 w-72 h-96 overflow-auto rounded-lg bg-base-300 border-solid border-2 border-neutral-content pb-16">
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
            <form onSubmit={sendMessage} className='chat-form flex bottom-0 fixed'>
                <input
                    className="input input-bordered w-full max-w-xs flex-grow"
                    type="text"
                    value={currentMessage}
                    onChange={(e) => setCurrentMessage(e.target.value)}
                    disabled={isBlocked}
                />
                <button type="submit" className="btn btn-primary">Envoyer</button>
            </form>
        </div>
    );
};

export default Chat;