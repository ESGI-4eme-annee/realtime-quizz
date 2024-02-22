import { useEffect, useState } from 'react';
import io from 'socket.io-client';

const socket = io('http://localhost:3000');

const Chat = ({ username, room }) => {
    const [currentMessage, setCurrentMessage] = useState('');
    const [messageList, setMessageList] = useState([]);
    // const [messages, setMessages] = useState([]);

    // useEffect(() => {
    //     socket.on('chatMessage', (msg) => {
    //         setMessages((messages) => [...messages, msg]);
    //     });

    //     return () => {
    //         socket.off('chatMessage');
    //     };
    // }, []);

    const sendMessage = async (event) => {
        event.preventDefault();

        if (currentMessage) {
            const messageData = {
                room: room,
                author: username,
                message: currentMessage,
                time: new Date().toLocaleTimeString()
            }
            await socket.emit('sendMessage', messageData);
            setMessageList((list) => [...list, messageData]);
        }
    };

    useEffect(() => {
        socket.on('receiveMessage', (data) => {
            setMessageList((list) => [...list, data]);
        })
    }, [socket]);

    return (
        <div>
            {/* {messages.map((msg, index) => (
                <div className={msg.name === username ? "chat chat-end" : "chat chat-start"} key={index}>
                    <div className="chat-header">{msg.name}</div>
                    <div className={msg.name === username ? "chat-bubble chat-bubble-secondary" : "chat-bubble"}>{msg.content}</div>
                    <div className="chat-footer opacity-50">
                        <time className="text-xs opacity-50">{msg.timeSent}</time>
                    </div>
                </div>
            ))} */}
            {messageList.map((messageContent) => {
                return <h1>{messageContent.message}</h1>
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