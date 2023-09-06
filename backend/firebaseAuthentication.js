const admin = require('firebase-admin')
require('dotenv').config()

// Se configura la información de autenticación de Firebase desde variables de entorno
const firebaseConfig = {
  privateKeyId: process.env.PRIVATE_KEY_ID,
  privateKey: process.env.PRIVATE_KEY,
  clientEmail: process.env.CLIENT_EMAIL,
  clientId: process.env.CLIENT_ID,
  authUri: process.env.AUTH_URI,
  tokenUri: process.env.TOKEN_URI,
  authProviderX509CertUrl: process.env.AUTH_PROVIDER_X509_CERT_URL,
  clientX509CertUrl: process.env.CLIENT_X509_CERT_URL,
  universeDomain: process.env.UNIVERSE_DOMAIN,
  projectId: process.env.PROJECT_ID
}

// Inicializa Firebase Admin SDK con la configuración proporcionada
const adminApp = admin.initializeApp({
  credential: admin.credential.cert(firebaseConfig)
})

console.log('Firebase Admin SDK inicializado', adminApp.name)

// Middleware de autenticación
function isAuthenticated (req, res, next) {
  const auth = admin.auth()
  // Verifica si el usuario está autenticado utilizando el token proporcionado en el encabezado de autorización
  const idToken = req.header('Authorization')
  console.log('En firebase Authentication' + idToken)
  if (!idToken) {
    // Si no se proporciona un token en el encabezado, se responde con un error de acceso no autorizado
    return res.status(401).json({ error: 'Acceso no autorizado - Token no proporcionado' });
  }

  auth
    .verifyIdToken(idToken)
    .then((decodedToken) => {
      // El token es válido, puedes acceder a la información del usuario en decodedToken
      req.user = decodedToken
      console.log('Token válido, usuario autenticado', decodedToken)
      next()
    })
    .catch((error) => {
      console.error('Error de verificación de token:', error)
      return res.status(401).json({ error: 'Acceso no autorizado - Token inválido' })
    })
}
// Exporta el middleware de autenticación
module.exports = isAuthenticated
