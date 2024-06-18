import React from 'react'
import Header from '../components/header.jsx'
import Navbar from '../components/navbar.jsx'
import Footer from '../components/footer.jsx'
import Books from '../components/booksList.jsx'
import Slider from '../components/slider.jsx'
import '../styles/index.css'
import { useState, useEffect } from 'react'



export default function LandingPage() {

    return (
        <>
        <Header />
        <Navbar />
        <Slider />
        <Books />
        <Footer />
        </>
    );
}

