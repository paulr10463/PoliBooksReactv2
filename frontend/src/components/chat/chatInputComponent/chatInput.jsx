import {useState} from 'react'
import './chatInput.css'
export default function ChatInput({ onSendMessage }) {
    const [message, setMessage] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        if (message.trim()) {
            onSendMessage(message);
            setMessage('');
        }
    };

    return (
        <form className="sendMessageForm" onSubmit={handleSubmit}>
            <input
                type="text"
                className="sendMessageInput"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Ingresa tu mensaje..."
            />
            <button type="submit" className="sendMessageButton">
                Enviar
            </button>
        </form>
    );
}