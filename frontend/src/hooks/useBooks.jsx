import { useState, useEffect } from "react";
import { fetchBooks } from "../services/bookService";

export const useBooks = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [books, setBooks] = useState([]);
    const [error, setError] = useState(null);

    useEffect(()=>{
        setIsLoading(true);
        fetchBooks()
            .then(data => {
                setBooks(data);
                setIsLoading(false);
            })
            .catch(error => {
                setError(error);
                setIsLoading(false);
            })
    },[]);

    return { books, isLoading, error}
};