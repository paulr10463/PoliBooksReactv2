import { environment } from "../environment/environment.prod";

export const confirmPayment = async (orderID, bookID, userID, idToken) => {
    const response = await fetch(`${environment.HOST}/payment/confirm`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `${idToken}`, 
            },
            body: JSON.stringify({
                orderID,
                bookId: bookID,
                userId: userID,
            }),
        });
    if (!response.ok) {
        throw new Error('Failed to verify payment');
    }
    return response.json()
};
