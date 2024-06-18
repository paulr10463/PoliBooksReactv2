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
  const token = Cookies.get('authData');

  if(!token){
    return res.status(403).json({ error: 'Acceso no autorizado - Token no proporcionado' });
  }

  try{
    const data = jwt.verify(token, process.env.JWT_SECRET);
    req.user = data;

  }catch(error){
    console.error('Error de verificación de token:', error)
    return res.status(401).json({ error: 'Acceso no autorizado - Token inválido' })
  }
}
// Exporta el middleware de autenticación
module.exports = isAuthenticated
