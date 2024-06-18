import React, { useEffect, useState } from 'react'
// Se importan componentes y utilidades necesarios.
import Header from '../components/header.jsx'
import Navbar from '../components/navbar.jsx'
import Footer from '../components/footer.jsx'
import UpdateBook from '../components/updateBook.jsx'
import { useParams } from 'react-router-dom'
import { useAuth } from '../utils/authContext.jsx'
import { useBookById } from '../hooks/useBooks.jsx'
import '../styles/index.css'
import LoadSpinner from '../components/shared/loadSpinnerComponent/loadSpinnerComponent.jsx'


export default function UpdateBookPage() {
    const { bookID } = useParams(); // Se obtiene el ID del libro desde los parámetros de la URL.
    const { authData } = useAuth(); // Se obtiene la información de autenticación del usuario.
    const { books, isLoading, error } = useBookById(bookID)


    return (
        authData.isAuthorized ? (
            <>
                <Header />
                <Navbar />
                {error}
                {isLoading && <div style={{ textAlign: "center", marginTop: "2rem" }}><LoadSpinner /></div>}
                {
                    books.id ? (
                        <UpdateBook book={books} />
                    ) : (
                        !isLoading && <div style={{ textAlign: "center", marginTop: "2rem" }}>No se encontraron resultados</div>
                    )
                }
                <Footer />
            </>
        ) : (
            <>
                {window.location.href = '/'}
            </>
        )
    );
}

