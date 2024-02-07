import React from 'react'
import Header from '../components/header.jsx'
import Navbar from '../components/navbar.jsx'
import Footer from '../components/footer.jsx'
import Books from '../components/booksList.jsx'
import RegisterUserBox from '../components/registerUserBox.jsx'
import PasswordField from '../components/micro-components/passwordField.jsx'


export default function RegisterUserPage() {
    return (
        <>
        <Header />
        <Navbar />
        <RegisterUserBox/>
        <Footer />
        </>
    );
}

