import { useState, useEffect } from "react";
import { fetchBookById, fetchBooks, fetchBooksAuthByUser, fetchBooksByTitle } from "../services/book.service";

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
    },[numItems]);

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
    },[title]);

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
    },[id]);

    return { books, isLoading, error}
};

export const useBooksByUserId = (userID, tokenID) => {
    const [isLoading, setIsLoading] = useState(false);
    const [books, setBooks] = useState([]);
    const [error, setError] = useState(null);

    useEffect(()=>{
        setIsLoading(true);
        fetchBooksAuthByUser(userID, tokenID)
            .then(data => {
                console.log('data', data);
                setBooks(data);
                setIsLoading(false);
            })
            .catch(error => {
                setError(error);
                setIsLoading(false);
            })
    },[userID, tokenID]);
    
    return { books, isLoading, error}
}
