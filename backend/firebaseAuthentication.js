const crypto = require('crypto');
const admin = require('firebase-admin');
require('dotenv').config();

// Configuración de Firebase Admin
const firebaseConfig = {
  privateKeyId: process.env.PRIVATE_KEY_ID,
  privateKey: process.env.PRIVATE_KEY, // Corrige saltos de línea en la llave
  clientEmail: process.env.CLIENT_EMAIL,
  clientId: process.env.CLIENT_ID,
  authUri: process.env.AUTH_URI,
  tokenUri: process.env.TOKEN_URI,
  authProviderX509CertUrl: process.env.AUTH_PROVIDER_X509_CERT_URL,
  clientX509CertUrl: process.env.CLIENT_X509_CERT_URL,
  universeDomain: process.env.UNIVERSE_DOMAIN,
  projectId: process.env.PROJECT_ID,
};

const adminApp = admin.initializeApp({
  credential: admin.credential.cert(firebaseConfig),
});

// Configuración de encriptación
const ENCRYPTION_KEY = Buffer.from(process.env.ENCRYPTION_KEY, 'base64');
const IV_LENGTH = 16;

/**
 * Encripta un token usando AES-256-GCM
 * @param {string} text - El token a encriptar
 * @returns {string} - Token encriptado con formato: iv:tag:encrypted
 */
function encryptToken(text) {
  const iv = crypto.randomBytes(12); // GCM recomienda 12 bytes para el IV
  const cipher = crypto.createCipheriv('aes-256-gcm', Buffer.from(ENCRYPTION_KEY, 'utf8'), iv);
  
  let encrypted = cipher.update(text, 'utf8', 'base64');
  encrypted += cipher.final('base64');
  
  // Obtener el tag de autenticación
  const authTag = cipher.getAuthTag();
  
  // Retornar el IV, tag de autenticación y el texto cifrado concatenados
  return `${iv.toString('base64')}:${authTag.toString('base64')}:${encrypted}`;
}

/**
 * Función complementaria para descifrar
 * @param {string} encryptedText - Texto cifrado en formato iv:tag:encrypted
 * @returns {string} - Texto descifrado
 */
function decryptToken(encryptedText) {
  const [ivBase64, authTagBase64, encryptedBase64] = encryptedText.split(':');
  
  const iv = Buffer.from(ivBase64, 'base64');
  const authTag = Buffer.from(authTagBase64, 'base64');
  const encrypted = Buffer.from(encryptedBase64, 'base64');
  
  const decipher = crypto.createDecipheriv('aes-256-gcm', Buffer.from(ENCRYPTION_KEY, 'utf8'), iv);
  decipher.setAuthTag(authTag);
  
  let decrypted = decipher.update(encrypted, 'base64', 'utf8');
  decrypted += decipher.final('utf8');
  
  return decrypted;
}

/**
 * Revoca los tokens de un usuario
 * @param {string} userID - ID del usuario
 */
function removeRefreshToken(userID) {
  return admin.auth().revokeRefreshTokens(userID);
}

/**
 * Verifica si un usuario está activo
 * @param {string} uid - UID del usuario
 * @returns {Promise<boolean>} - True si el usuario está activo, false si está deshabilitado
 */
async function isUserActive(uid) {
  try {
    const userRecord = await admin.auth().getUser(uid);
    return !userRecord.disabled;
  } catch (error) {
    console.error('Error al verificar si el usuario está activo:', error);
    throw new Error('Error al verificar el estado del usuario');
  }
}

// Middleware de autenticación
function isAuthenticated(req, res, next) {
  if (!adminApp) {
    return res.status(500).json({ error: 'Error de autenticación - Firebase Admin no inicializado' });
  }

  const auth = admin.auth();
  const encryptedToken = req.header('Authorization');
  if (!auth) {
    return res.status(500).json({ error: 'Error de autenticación - Firebase Auth no inicializado' });
  }

  if (!encryptedToken) {
    return res.status(401).json({ error: 'Acceso no autorizado - Token no proporcionado' });
  }

  let idToken;

  try {
    // Desencripta el token antes de verificarlo
    idToken = decryptToken(encryptedToken);
  } catch (error) {
    return res.status(401).json({ error: 'Acceso no autorizado - Token inválido (encriptación fallida)' });
  }

  auth
    .verifyIdToken(idToken, true)
    .then(async (decodedToken) => {
      const uid = decodedToken.uid;
      
      try {
        req.user = decodedToken; // Almacena la información del usuario
        next();
      } catch (error) {
        return res.status(500).json({ error: 'Error al verificar el estado del usuario' });
      }
    })
    .catch((error) => {
      console.error('Error de verificación de token:', error);
      return res.status(401).json({ error: 'Acceso no autorizado - Token inválido' });
    });
}

module.exports = { isAuthenticated, encryptToken, removeRefreshToken };
