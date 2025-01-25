import { environment } from "../environment/environment.prod";

export const fetchBooks = async (numItems) => {
    const response = await fetch(`${environment.HOST}/read/books/${numItems}`);
    if (!response.ok) {
        throw new Error('Failed to fetch books');
    }
    return response.json();
};

export const fetchBookById = async (id) => {
    const response = await fetch(`${environment.HOST}/read/book/${id}`);
    if (!response.ok) {
        throw new Error('Failed to fetch books');
    }
    return response.json();
};

export const fetchBooksByTitle = async (title) => {
    const response = await fetch(`${environment.HOST}/search/books?title=${title}`);
    if (!response.ok) {
        throw new Error('Failed to fetch books');
    }
    return response.json();
};

export const fetchBooksAuthByUser = async (userID, idToken) => {
    const response = await fetch(`${environment.HOST}/read/book/auth/${userID}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `${idToken}`
        },
    })
    if (!response.ok) {
        throw new Error('Failed to fetch books');
    }
    return response.json()
};

export const deleteBooks = async (bookId, idToken) => {
    try {
        const response = await fetch(`${environment.HOST}/delete/book/${bookId}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `${idToken}`
            },
        });

        if (response.ok) {  // If status is 200-299
            return await response.json();  // assuming the server sends a JSON response
        } else {
            const errorResponse = await response.text();  // Get text response to avoid JSON parse error if not JSON
            throw new Error(errorResponse || 'Unknown error occurred');
        }
    } catch (error) {
        console.error("Error in deleteBooks:", error);
        throw new Error(error.message || 'Error processing your request'); // Rethrow to ensure it can be caught by caller
    }
}