import React from 'react';
import './chatInput.css';
export default function ChatInput({ onSendMessage, value, onChange }) {
    const handleKeyPress = (event) => {
        if (event.key === 'Enter') {
            onSendMessage();
        }
    };

    return (
        <div className="sendMessageForm">
            <input
                type="text"
                value={value}
                onChange={onChange}
                onKeyPress={handleKeyPress}
                placeholder="Escribe un mensaje..."
                className='sendMessageInput'
            />
            <button className="sendMessageButton" onClick={onSendMessage}>Enviar</button>
        </div>
    );
}
