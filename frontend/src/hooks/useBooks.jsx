import { useState, useEffect } from "react";
import { fetchBookById, fetchBooks, fetchBooksByTitle } from "../services/book.service";

export const useBooks = (numItems) => {
    const [isLoading, setIsLoading] = useState(false);
    const [books, setBooks] = useState([]);
    const [error, setError] = useState(null);

    useEffect(()=>{
        setIsLoading(true);
        fetchBooks(numItems)
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

export const useBooksByTitle = (title) => {
    const [isLoading, setIsLoading] = useState(false);
    const [books, setBooks] = useState([]);
    const [error, setError] = useState(null);

    useEffect(()=>{
        setIsLoading(true);
        fetchBooksByTitle(title)
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

export const useBookById = (id) => {
    const [isLoading, setIsLoading] = useState(false);
    const [books, setBooks] = useState([]);
    const [error, setError] = useState(null);

    useEffect(()=>{
        setIsLoading(true);
        fetchBookById(id)
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
