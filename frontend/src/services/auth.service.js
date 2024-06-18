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

export function loginJWT(userData) {
    return fetch(`${environment.HOST}/loginjwt/`,
        {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(userData)
        })
}