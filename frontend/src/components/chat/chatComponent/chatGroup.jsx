import React, { useEffect, useState } from 'react';
import ChatMessage from '../chatMessageComponent/chatMessage';
import ChatInput from '../chatInputComponent/chatInput';
import './chatGroup.css';
import Message from '../../../models/message.model';
import { useAuth } from '../../../utils/authContext';
import { environment } from '../../../environment/environment.prod';
export default function ChatGroup() {
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState("");
    const [socket, setSocket] = useState(null);
    const { authData } = useAuth(); // Removed setAuthorization since it's not used
     


    const handleSendMessage = () => {
        if (newMessage.trim() !== '') {
            if (socket && socket.readyState === WebSocket.OPEN) {
                socket.send(JSON.stringify(message));
                setMessages(prevMessages => [...prevMessages, message]); // Update messages state correctly
                setNewMessage(''); // Clear the input field after sending the message
            } else {
                console.error('WebSocket no está abierto');
            }
        }
    };

    function getFormattedDate(date) {
        date = date || new Date();       
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are zero-based
        const year = date.getFullYear();
        
        const hours = String(date.getHours()).padStart(2, '0');
        const minutes = String(date.getMinutes()).padStart(2, '0');
        const seconds = String(date.getSeconds()).padStart(2, '0');
        
        return `${day}-${month}-${year} ${hours}:${minutes}:${seconds}`;
      }


    return (
        <div className="chatGroup">
            <div className="chatGroup__messages">
                {messages.map((msg, index) => (
                    <ChatMessage key={index} text={msg.message} user={msg.user} date={getFormattedDate(new Date(msg.date))} />
                ))}
            </div>
            <ChatInput 
                onSendMessage={handleSendMessage}
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
            />
        </div>
    );
}
