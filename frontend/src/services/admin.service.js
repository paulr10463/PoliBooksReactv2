import { environment } from "../environment/environment.prod";

/**
 * Check if the current user is an admin.
 * @param {string} idToken - The ID token of the authenticated user.
 * @returns {Promise<Response>}
 */
export function isAdmin(idToken) {
    return fetch(`${environment.HOST}/admin`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `${idToken}`
        },
    });
}

/**
 * Fetch general logs.
 * @param {string} authData - The ID token of the authenticated user.
 * @param {number} limit - The number of logs to fetch per page (default is 10).
 * @param {number} page - The page number to fetch (default is 1).
 * @returns {Promise<Response>} - Returns a promise with the logs data.
 */
export function fetchLogs(authData, limit = 10, page = 1) {
    return fetch(`${environment.HOST}/admin/logs?limit=${limit}&page=${page}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `${authData.idToken}`
        }
    });
}

/**
 * Fetch critical logs.
 * @param {string} idToken - The ID token of the authenticated user.
 * @param {number} limit - The number of logs to fetch per page (default is 10).
 * @param {number} page - The page number to fetch (default is 1).
 * @returns {Promise<Response>} - Returns a promise with the critical logs data.
 */
export function fetchCriticalLogs(idToken, limit = 10, page = 1) {
    return fetch(`${environment.HOST}/admin/critical-logs?limit=${limit}&page=${page}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `${idToken}`
        },
    });
}
