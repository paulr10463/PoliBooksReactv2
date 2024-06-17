import React from 'react'
import Header from '../components/header.jsx'
import Navbar from '../components/navbar.jsx'
import Footer from '../components/footer.jsx'
import Books from '../components/booksList.jsx'
import ProductDetail from '../components/productDetail.jsx'
import { useParams } from 'react-router-dom'
import '../styles/index.css'
import { useEffect, useState } from 'react'
import { useBookById } from '../hooks/useBooks.jsx'
import LoadSpinner from '../components/shared/loadSpinnerComponent/loadSpinnerComponent.jsx'

export default function ProductDetailPage() {
    const { bookID } = useParams();
    const { books, isLoading, error } = useBookById(bookID);

    return (
        <>
            <Header />
            <Navbar />
            {error}
            {isLoading && <div style={{ textAlign: "center" }}><LoadSpinner /></div>}
            {
                books.id ? (
                    <ProductDetail book={books} />
                ) : (
                    !isLoading && <p>No se encontró el libro</p>
                )
            }
            <Books />
            <Footer />
        </>
    );
}

