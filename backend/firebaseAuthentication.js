const admin = require('firebase-admin')
require('dotenv').config()
const jwt = require('jsonwebtoken')
const Cookies = require('js-cookie')

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
  const authHeader = req.headers['authorization'];

  if (!authHeader) {
    return res.status(401).json({ message: 'No token provided' });
  }

  const token = authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'No token provided' });
  }

  jwt.verify(token, process.env.JWTSECRET, (err, decoded) => {
    if (err) {
      return res.status(403).json({ message: 'Failed to authenticate token' });
    }

    // Si el token es válido, guarda el payload decodificado en la solicitud para uso posterior
    req.user = decoded;
    next();
  });
}
// Exporta el middleware de autenticación
module.exports = isAuthenticated
