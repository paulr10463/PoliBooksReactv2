import { environment } from "../environment/environment.prod";

export const fetchResetPassword = async (email) => {
    return fetch(`${environment.HOST}/user/reset-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({email}),
      })
}
