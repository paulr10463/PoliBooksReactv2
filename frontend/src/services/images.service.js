import { environment } from "../environment/environment.prod";

export function postImage(formData) {
    return fetch(`${environment.HOST}/upload`, {
        method: 'POST',
        body: formData,
    })
}