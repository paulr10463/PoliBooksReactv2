// src/services/bookService.js
import { environment } from "../environment/environment.prod";

export const fetchBooks = async () => {
    const response = await fetch(`${environment.HOST}/read/books/12`);
    if (!response.ok) {
        throw new Error('Failed to fetch books');
    }
    return response.json();
};