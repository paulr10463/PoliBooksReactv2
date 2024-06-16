import "bootstrap/dist/css/bootstrap.min.css";
// Se importan los componentes y estilos 
import Book from "./micro-components/bookForSale.jsx";
import "../styles/booksList.css";
import { useBooks } from "../hooks/useBooks.jsx";

export default function Books() {
    
    const {books, isLoading, error} = useBooks();

    return (
        // Renderización del componente
        <section id="featured-services" className="featured-services">
            <div className="books-container">
            {<div>Cargando ...</div> && isLoading}
            {error && <p>Error: {error}</p>}
            {books && books.length > 0 ? (
                    books.map((book, index) => (
                        <Book key={index} book={book} />
                    ))) : (
                    <p>No se encontraron libros.</p>
            )}
            </div>
        </section>
    );
}


