import './chatMessage.css'; // Import the CSS file
3
export default function ChatMessage({ user, date, text}) {
    return (
        <>
        <div className="chatMessage">
            <div className="chatMessageHeader">
                <span className="chatMessageUser">{user}</span>
                <span className="chatMessageDate">{date}</span>
            </div>
            <div className="chatMessageContent">
                {text}
            </div>
        </div>
        </>
    );
}
