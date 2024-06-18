import { environment } from "../environment/environment.prod";

export const fetchResetPassword = async (email) => {
    return fetch(`${environment.HOST}/user/reset-password`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
    }).catch(() => {
        throw new Error("Error reseting password")
    });
}

export const registerUser = async(name,email,password,phone) => {
    return fetch('https://polibooksapi.azurewebsites.net/api/register', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({name, email, password, phone}),
    })
}

