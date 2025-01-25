import React from 'react'
import Header from '../../components/header.jsx'
import Navbar from '../../components/navbar.jsx'
import Payment from '../../components/payment/Payment.jsx'
import Footer from '../../components/footer.jsx'
import './PaymentPage.css'
import { useAuth } from '../../utils/authContext.jsx'
import { useLocation } from "react-router-dom";
import { useEffect } from 'react';

export default function PaymentPage() {
    const { authData } = useAuth();
    const location = useLocation();

    const book = location.state;
    useEffect(() => {
        console.log(book);
    }, [book]);

    return (
        authData.isAuthorized ? (
        <>
        <Header />
        <Navbar />
        <Payment book={book} />
        <Footer />
        </>
        ) : (
            <>
                {window.location.href = '/'}
            </>
        )
    );
}

