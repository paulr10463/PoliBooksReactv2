import './chatMessage.css'; // Import the CSS file

export default function ChatMessage({ userName, date, message }) {
    return (
        <div className="chatMessage">
            <div className="chatMessageHeader">
                <span className="chatMessageUser">{userName}</span>
                <span className="chatMessageDate">{date}</span>
            </div>
            <div className="chatMessageContent">
                {message}
            </div>
        </div>
    );
}
