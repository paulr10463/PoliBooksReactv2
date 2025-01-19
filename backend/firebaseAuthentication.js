const admin = require('firebase-admin')
require('dotenv').config()

// Se configura la información de autenticación de Firebase desde variables de entorno
const firebaseConfig = {
  type: "service_account",
  project_id: "polibooksweb",
  private_key_id: "669785567e73c744e9e0d2641be14661a8cf7d27",
  private_key: "-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQCNnCVWaT7MzaRw\nu7YrqrfMEUfv+ucahcBCu3YrOauE9VoJGDB8zV650uwA8kC0uYJBEwBJNEXYR9N7\nD45EjcJztuwesx2bsxBcflHQMvyOTLsxahkZZV3WQ8+VuEz/6vlWeiJs+/fVngfw\nKhx6HBJ9M1VtPxfIuqjJKJ1acCZOJsdDKzVWPwCEiAwS7ORKGhmg68brQWqbmQY/\nNsb1dA0T1o8IRyMZcQpqEP+fLHaSArltF3q4W5GmudsG1IVST3lVoyV9FgkYSodM\ndCYnxGY/mY8RnzZwpLx2frYWzL36fZ+v4makj0vsA5xmyfJ6COTYklPVgfDurejp\nx/pZTWnHAgMBAAECggEABlpG4oV+J7nh8py5I2RZMnJkA8QBshLl+RhnyLChnSlU\njKvlIPQll7h6leBIPtNDoJ+1l5McvwMZ3Z9pBnJFkuNV3Fq0rVNvHHcePHTNF6Uh\nkKntzlHZz87i9Rh7e8+St+pquPDkwVSBjqiU9nVj7vHqlygJbRvSjpOf23rEfST3\nGiZqRriv4+l7bvLaOW4WvYb5duhuvX9LXWIVXLVU80mU2yVrK5boC4h5xl/nr6o6\nTUMrOkpNe1eekHP3+veHqQb7F9yEsXVPOFYa63KVoz9SIlvAgSFSpg9dyDq1Tci2\nVyquhyam7n5Pl9lmjp1gtUfKaXjs4ZTS19KSrEkrQQKBgQDGwt+4hBqvkQjHPg1L\nh/6oe2aixi8xjqgpA9qycUkmpLyox8COrh2FUTkIWoKPNHXjr22qvmDQSnAj2VtN\nvbXrzqUPzca2koSbW4GAvOQQiWfLytAZvKuuc8XeD2mQM8ezTu6b8yw2SYOFUux4\n2zu93LOfxffMZ15TGyB83l41KQKBgQC2Y/NUqt/Sd2IRmBH/e2AKx62ht4o+G2Rs\nrBUi5tmaGj51VveTSVxCXAUhgzYWxYZk77C8WDxBZDP0eNV6i+9aoIlk2Xzmudf5\nYa5xu+YpUXPRwkqCVGE3KeeHm182ygSgzu0GygN4Go4wULsh2PkY0gfUV7H9/1Nh\nKGRmPlgVbwKBgEzhuDPhNYlPqnuXLwFWW1TEVtEDo+Ghcr5atU9sroT6F9eZXIxU\nISseXdczW2kVO7yUcPEorr4i7PmQ69ZIWYQa7JIOYJziU9TcMl2fswAKhlG344Lx\nDd9u/MyGXajfvpFHKNi92Q4upWb+ymV9N8CbDAfzRYSVP1EaHxjt0rbxAoGAT6Wo\nHgIciaEej0ZUHbf3wd1ewm8PDH4Txa0D8eDTh4sMWVtn88amZkge6XqOBTWusadG\nC4mQjpG+anTV7JTtKitOtF6RP4RKfxmb/wipwsNSC3iH5xAH//nppHtCAgAIM10J\nftx61VjrXMf0YByK8r7NMno1PRDhjV0BMvDosDsCgYEAg0iyUHxPdWOQFuN+30lU\nSCLCAYdMoayH73Nr7ilUYDJrNQFH1JSTKZ2YbAD5CUVVo8d5x5OORvaIY/ag8Jpw\n+mqVu3nZTwS2GHnf+DwxQQDrGDtcD3lh8Rz7Qa69NzzWNA1jpXYPphk9n5q3f75d\nCqwvfueMoO0clRWOd/ZVuyA=\n-----END PRIVATE KEY-----\n",
  client_email: "firebase-adminsdk-syxql@polibooksweb.iam.gserviceaccount.com",
  client_id: "103504578597298992166",
  auth_uri: "https://accounts.google.com/o/oauth2/auth",
  token_uri: "https://oauth2.googleapis.com/token",
  auth_provider_x509_cert_url: "https://www.googleapis.com/oauth2/v1/certs",
  client_x509_cert_url: "https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-syxql%40polibooksweb.iam.gserviceaccount.com",
  universe_domain: "googleapis.com"
}

// Inicializa Firebase Admin SDK con la configuración proporcionada
const adminApp = admin.initializeApp({
  credential: admin.credential.cert(firebaseConfig)
})

console.log('Firebase Admin SDK inicializado', adminApp.name)

// Middleware de autenticación
function isAuthenticated(req, res, next) {
  const auth = admin.auth()
  // Verifica si el usuario está autenticado utilizando el token proporcionado en el encabezado de autorización
  const idToken = req.header('Authorization')
  if (!idToken) {
    // Si no se proporciona un token en el encabezado, se responde con un error de acceso no autorizado
    return res.status(401).json({ error: 'Acceso no autorizado - Token no proporcionado' });
  }

  auth
    .verifyIdToken(idToken)
    .then((decodedToken) => {
      // El token es válido, puedes acceder a la información del usuario en decodedToken
      req.user = decodedToken
      next()
    })
    .catch((error) => {
      console.error('Error de verificación de token:', error)
      return res.status(401).json({ error: 'Acceso no autorizado - Token inválido' })
    })
}
// Exporta el middleware de autenticación
module.exports = isAuthenticated
