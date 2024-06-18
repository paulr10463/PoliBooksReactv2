import { useEffect, useState } from 'react';
import ChatMessage from '../chatMessageComponent/chatMessage';
import ChatInput from '../chatInputComponent/chatInput';
import './chatGroup.css';

export default function ChatGroup() {
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [socket, setSocket] = useState(null);

    useEffect(() => {
        // Create a WebSocket connection
        const ws = new WebSocket('ws://localhost:5000');
    
        // Set up event listeners after WebSocket is opened
        ws.addEventListener('open', (event) => {
            console.log('Conexión establecida con el servidor WebSocket');
        });
    
        ws.addEventListener('message', (event) => {
            console.log('Mensaje recibido del servidor WebSocket');
            event.data.arrayBuffer().then((data) => {
                const message = new TextDecoder('utf-8').decode(data);
                setMessages(prevMessages => [...prevMessages, message]); // Update messages state correctly
            });
        });
    
        ws.addEventListener('close', () => {
            console.log('Connection closed');
        });
    
        ws.addEventListener('error', (event) => {
            console.error('WebSocket error observed:', event);
        });
    
        // Update the socket state after setting up listeners
        setSocket(ws);
    
        // Clean up on component unmount
        return () => {
            ws.close();
        };
    }, []); // Only run once, on component mount
    

    const handleSendMessage = () => {
        if (newMessage.trim() !== '') {
            if (socket && socket.readyState === WebSocket.OPEN) {
                socket.send(newMessage);
                setMessages(prevMessages => [...prevMessages, newMessage]); // Update messages state correctly
                setNewMessage(''); // Clear the input field after sending the message
            } else {
                console.error('WebSocket no está abierto');
            }
        }
    };

    return (
        <div className="chatGroup">
            <div className="chatGroup__mesages">
                {messages.map((msg, index) => (
                    <ChatMessage key={index} message={msg} />
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
