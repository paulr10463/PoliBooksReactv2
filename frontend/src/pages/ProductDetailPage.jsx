import React from 'react'
import Header from '../components/header.jsx'
import Navbar from '../components/navbar.jsx'
import Footer from '../components/footer.jsx'
import Books from '../components/booksList.jsx'
import ProductDetail from '../components/productDetail.jsx'
import { useParams } from 'react-router-dom'
import '../styles/index.css'
import { useEffect, useState } from 'react'

export default function ProductDetailPage() {
    const { bookID } = useParams();
    const [ book, setBook] = useState({});
    
    useEffect(() => {
        fetch(`https://polibooksapi.azurewebsites.net/api/read/book/${bookID}`)
            .then(response => response.json())
            .then(data => setBook(data))
    }, []);

    return (
        <>
        <Header />
        <Navbar />
        {
            book.id ? (
                <ProductDetail book={book}/>
            ) : (
                <p>Cargando...</p>
            )
        }
        <Books />
        <Footer />
        </>
    );
}

