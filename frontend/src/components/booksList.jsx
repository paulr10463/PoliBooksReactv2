import "bootstrap/dist/css/bootstrap.min.css";
// Se importan los componentes y estilos 
import Book from "./micro-components/bookForSale.jsx";
import "../styles/booksList.css";
import { useBooks } from "../hooks/useBooks.jsx";
import LoadSpinner from "./shared/loadSpinnerComponent/loadSpinnerComponent.jsx";

export default function Books() {

    const { books, isLoading, error } = useBooks(9);

    return (
        // Renderización del componente
        <section id="featured-services" className="featured-services">

            <div className="books-container">

                {error && <p>Error: {error}</p>}
                {isLoading && <LoadSpinner />}
                {books && books.length > 0 ? (
                    books.map((book, index) => (
                        <Book key={index} book={book} />
                    ))) : (
                    !isLoading &&
                    "No se encuentran libros"
                )}
            </div>
        </section>
    );
}


