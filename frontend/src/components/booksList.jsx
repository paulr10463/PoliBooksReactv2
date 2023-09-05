import "bootstrap/dist/css/bootstrap.min.css";
import Book from "./micro-components/bookForSale.jsx";
import "../styles/booksList.css";
import { useState, useEffect } from "react";

export default function Books() {
    const [books, setBooks] = useState([]);
    
    useEffect(() => {
        fetch('https://polibooksapi.azurewebsites.net/api/read/books/12')
        .then(response => response.json())
        .then(data => setBooks(data))
    }, [])

    return (
        <section id="featured-services" className="featured-services">
            <div className="books-container">
            {books && books.length > 0 ? (
                    books.map((book, index) => (
                        <Book key={index} book={book} />
                    ))) : (
                    <p>No se encontraron libros.</p>
                )}
            </div>
        </section>
    );
};
/*
                {books &&books.map((book, index) => (
                    <Book key={index} title={book.title} imageURL={book.image} price={book.price} rating={4} description={book.description} />
                ))
                }
*/

