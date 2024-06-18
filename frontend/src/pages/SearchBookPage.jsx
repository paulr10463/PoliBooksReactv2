import React, { useEffect, useState } from 'react'
import Header from '../components/header.jsx'
import Navbar from '../components/navbar.jsx'
import Footer from '../components/footer.jsx'
import Book from '../components/micro-components/bookForSale.jsx'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faX } from '@fortawesome/free-solid-svg-icons'
import { useNavigate, useLocation } from 'react-router-dom';
import '../styles/index.css'
import '../styles/searchBookPage.css'
import { useBooksByTitle } from '../hooks/useBooks.jsx'
import LoadSpinner from '../components/shared/loadSpinnerComponent/loadSpinnerComponent.jsx'

export default function SearchBookPage() {
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const { books, isLoading, error } = useBooksByTitle(queryParams.get('title'));

    return (
        <>
            <Header />
            <Navbar />
            {queryParams.get('title') &&
                <div className="filter-container">
                    <div className="filter-applied">
                        <label for="filter-applied">{queryParams.get('title')}
                            <a href='/search/books?title='><FontAwesomeIcon icon={faX} /></a>
                        </label>
                    </div>
                </div>
            }
            <section id="featured-services" className="featured-services">
                {/* Show loading spinner when isLoading is true */}
                {isLoading && <div style={{ textAlign: "center" }}><LoadSpinner /></div>}

                <div className="books-container">
                    {/* Check if books array exists and has items */}
                    {books && books.length > 0 ? (
                        books.map((book, index) => (
                            <Book key={index} book={book} />
                        ))
                    ) : (
                        !isLoading && (
                            <div style={{ textAlign: "center" }}>
                                No se encontraron resultados
                            </div>
                        )
                    )}
                </div>
            </section>

            <Footer />
        </>
    );
}

/*
Pagination for the future
        <section className="pagination-search-container">
                <div className="page-number number-selected"><a href="#">1</a></div>
                <div className="page-number"><a href="#">2</a></div>
                <div className="page-number"><a href="#">3</a></div>
                <div className="page-number"><a href="#">4</a></div>
                <div className="page-number"><a href="#">5</a></div>

          </section>
*/
