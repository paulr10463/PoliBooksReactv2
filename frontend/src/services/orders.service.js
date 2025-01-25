import { environment } from "../environment/environment.prod";

export const fetchOrdersByUser = async (userID, idToken) => {
    const response = await fetch(`${environment.HOST}/read/orders/auth/${userID}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `${idToken}`
        },
    })
    if (!response.ok) {
        throw new Error('Failed to fetch orders');
    }
    return response.json()
};