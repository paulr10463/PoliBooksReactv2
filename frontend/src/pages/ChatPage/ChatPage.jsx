import Header from '../../components/header.jsx'
import Navbar from '../../components/navbar.jsx'
import Footer from '../../components/footer.jsx'
import { useAuth } from '../../utils/authContext.jsx'
import ChatGroup from '../../components/chat/chatComponent/chatGroup.jsx'
import './ChatPage.css'

export default function ChatPage() {
    const { authData } = useAuth();
    return (
        authData.isAuthorized ? (
        <>
        <Header />
        <Navbar />
        <ChatGroup />
        <Footer />
        </>
        ) : (
            <>
                {window.location.href = '/'}
            </>
        )
    );
}

