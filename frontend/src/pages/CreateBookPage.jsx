import React from 'react'
import Header from '../components/header.jsx'
import Navbar from '../components/navbar.jsx'
import Footer from '../components/footer.jsx'
import CreateBook from '../components/createBook.jsx'
import '../styles/index.css'
import { useAuth } from '../utils/authContext.jsx'

export default function CreateBookPage() {
    const { authData } = useAuth();
    return (
        authData.isAuthorized ? (
        <>
        <Header />
        <Navbar />
        <CreateBook />
        <Footer />
        </>
        ) : (
            <>
                {window.location.href = '/'}
            </>
        )
    );
}

