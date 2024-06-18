import ChatMessage from "../chatMessageComponent/chatMessage";
import ChatInput from "../chatInputComponent/chatInput";
import './chatGroup.css'
export default function ChatGroup(){
    return (
        <>
            <div className="chatGroup">
                <ChatMessage date={2000-12-12} message="Hola" userName="Palex" key={1}></ChatMessage>
                <ChatMessage date={2000-12-12} message="Hola" userName="Palex" key={2}></ChatMessage>
                <ChatMessage date={2000-12-12} message="Hola" userName="Palex" key={3}></ChatMessage>
                <ChatInput />
            </div>
            
        </>
    );
}