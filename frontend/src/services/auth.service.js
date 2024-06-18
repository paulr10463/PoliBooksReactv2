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