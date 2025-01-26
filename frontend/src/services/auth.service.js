import { environment } from "../environment/environment.prod";

export function isAuth(idToken) {
    return fetch(`${environment.HOST}/isAuth`,
        {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `${idToken}`
            },
        })
}

export function logout(idToken, userID) {
    return fetch(`${environment.HOST}/logout`,
        {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `${idToken}`
            },
            body: JSON.stringify({ userID })
        })
}