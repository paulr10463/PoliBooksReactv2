import "bootstrap/dist/css/bootstrap.min.css";
// Se importan los componentes y estilos 
import Book from "./micro-components/bookForSale.jsx";
import "../styles/booksList.css";
import { useState, useEffect } from "react";

export default function Books() {
    // Declaración de estado para almacenar la lista de libros.
    const [books, setBooks] = useState([]);
    
    useEffect(() => {
        // Se realiza una solicitud a la API para obtener la lista de libros.
        fetch('https://polibooksapi.azurewebsites.net/api/read/books/12')
        .then(response => response.json())
        .then(data => setBooks(data))
    }, [])

    return (
        // Renderización del componente
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


