// Importación de módulos
const express = require('express');
const fetch = require('node-fetch');
const cors = require('cors');
const { initializeApp } = require('firebase/app');
const { getFirestore, updateDoc, collection, query, limit, orderBy, startAfter, getDocs, where, getDoc, addDoc, doc, deleteDoc } = require('firebase/firestore');
const {
  getAuth,
  sendPasswordResetEmail,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword
} = require("firebase/auth");
const multer = require('multer');
const { getStorage, ref, uploadBytesResumable, getDownloadURL } = require("firebase/storage");
const { isAuthenticated, encryptToken, removeRefreshToken } = require('../firebaseAuthentication');
const firebaseConfig = require('../firebaseConfig');
require('dotenv').config();

const { sanitizeInput, validateUID } = require('../utils/sanitizeUtils');

const FILE_LIMITS = {
  maxFiles: 5,
  maxFileSize: 5 * 1024 * 1024, // 5MB por archivo
  maxTotalSize: 20 * 1024 * 1024, // 20MB total
  allowedMimeTypes: ['image/jpeg', 'image/png', 'image/gif', 'image/webp']
};

// Inicialización de Firebase
const appFirebase = initializeApp(firebaseConfig);
const auth = getAuth(appFirebase);
const db = getFirestore(appFirebase);
const firebaseStorage = getStorage(appFirebase);
const storage = multer.memoryStorage();
const upload = multer({
  storage: storage,
  limits: {
    files: FILE_LIMITS.maxFiles,
    fileSize: FILE_LIMITS.maxFileSize
  },
  fileFilter: (req, file, cb) => {
    if (!FILE_LIMITS.allowedMimeTypes.includes(file.mimetype)) {
      return cb(new Error('Tipo de archivo no permitido'), false);
    }
    cb(null, true);
  }
});


// Creación de una instancia en Express
const app = express();

// Configuración básica de seguridad
app.use(express.json({ limit: '2mb' })); // Limitar tamaño de payload
app.disable('x-powered-by'); // Ocultar header X-Powered-By

// Configuración de headers de seguridad
app.use((req, res, next) => {
  // Headers de seguridad básicos
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
  
  // Política de seguridad de contenido
  res.setHeader('Content-Security-Policy', "default-src 'self'");
  
  next();
});

// Manejo de errores para JSON malformado
app.use((err, req, res, next) => {
  if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
    return res.status(400).json({ error: 'JSON inválido' });
  }
  next();
});

const corsOptions = {
  origin: (origin, callback) => {
    const allowedOrigins = [
      'https://poli-books-react.vercel.app'
    ];
    if (allowedOrigins.includes(origin) || !origin) {
      // Permitir el origen
      callback(null, true);
    } else {
      callback(new Error('Origen no permitido por CORS'));
    }
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE'], // Métodos HTTP permitidos
  allowedHeaders: ['Content-Type', 'Authorization'], // Encabezados permitidos
  credentials: true, // Permitir cookies/credenciales
};

app.use(cors(corsOptions));

const checkAdmin = async (req, res, next) => {
  try {
    // Validar y sanitizar el UID
    if (!req.user || !req.user.uid) {
      return res.status(400).json({ error: 'Usuario no autenticado' });
    }

    const userId = validateUID(req.user.uid);

    // Buscar usuario en Firestore
    const usersCol = collection(db, 'users');
    const userQuery = query(usersCol, where('uid', '==', sanitizeInput(userId)));
    const querySnapshot = await getDocs(userQuery);

    // Verificar si el usuario existe
    if (querySnapshot.empty) {
      return res.status(403).json({ error: 'Usuario no encontrado o no autorizado' });
    }

    const userData = sanitizeInput(querySnapshot.docs[0].data());

    // Validar rol del usuario
    if (userData.role !== 'admin') {
      return res.status(403).json({ error: 'Acceso denegado: no eres administrador' });
    }

    next(); // Usuario es administrador, continuar con la solicitud
  } catch (error) {
    console.error('Error al verificar rol de administrador:', error.message);

    // Respuesta genérica para no filtrar información
    res.status(500).json({ error: 'Error interno al verificar la autorización' });
  }
};

// Ruta protegida solo para administradores
app.get('/api/admin', isAuthenticated, checkAdmin, async (req, res) => {
  res.status(200).json({ message: 'Bienvenido al panel de administrador' });
});

const logCriticalEvent = async (eventType, description, additionalData = {}) => {
  try {
    const logData = {
      eventType, // Tipo de evento (Error DB, Intento fallido, etc.)
      description, // Descripción del evento
      additionalData, // Información adicional
      timestamp: new Date().toISOString(), // Fecha y hora del evento
    };

    // Guardar el log en Firestore
    await addDoc(collection(db, 'critical_logs'), logData);
    console.log('Evento crítico registrado:', logData);
  } catch (error) {
    console.error('Error al registrar el evento crítico:', error);
  }
};

const logRequests = async (req, res, next) => {
  try {
    const logData = {
      method: req.method,
      url: req.originalUrl,
      headers: req.headers,
      body: req.body,
      timestamp: new Date().toISOString(),
    };
    // Guardar el log en Firestore
    await addDoc(collection(db, 'logs'), logData);
  } catch (error) {
    console.error('Error al guardar el log:', error);
  }
  next();
};

// Usar el middleware en todas las rutas
app.use(logRequests);

// Ruta básica de prueba
app.get('/api', (req, res) => {
  const path = `/api/item/${require('uuid').v4()}`;
  res.setHeader('Cache-Control', 's-max-age=1, stale-while-revalidate');
  res.send(`Hello! Go to item: <a href="${path}">${path}</a>`);
});


// Configuración de multer con límites
app.post('/api/upload', isAuthenticated, upload.array('files', FILE_LIMITS.maxFiles), async (req, res) => {
  try {
    const files = req.files;

    if (!files || files.length === 0) {
      return res.status(400).json({ error: 'No se proporcionaron archivos.' });
    }

    // Verificar tamaño total de archivos
    const totalSize = files.reduce((sum, file) => sum + file.size, 0);
    if (totalSize > FILE_LIMITS.maxTotalSize) {
      return res.status(400).json({ 
        error: `El tamaño total de los archivos excede el límite de ${FILE_LIMITS.maxTotalSize / (1024 * 1024)}MB` 
      });
    }

    // Validar cada archivo individualmente
    for (const file of files) {
      if (!FILE_LIMITS.allowedMimeTypes.includes(file.mimetype)) {
        return res.status(400).json({
          error: 'Tipo de archivo no permitido',
          details: {
            filename: file.originalname,
            type: file.mimetype
          }
        });
      }

      if (file.size > FILE_LIMITS.maxFileSize) {
        return res.status(400).json({
          error: `El archivo ${file.originalname} excede el tamaño máximo permitido de ${FILE_LIMITS.maxFileSize / (1024 * 1024)}MB`
        });
      }
    }

    // Generar nombres de archivo seguros
    const uploadPromises = files.map(async (file) => {
      const safeFileName = `${Date.now()}-${sanitizeInput(file.originalname.replace(/[^a-zA-Z0-9.-]/g, '_'))}`;
      const storageRef = ref(firebaseStorage, `/files/${safeFileName}`);
      
      const metadata = {
        contentType: file.mimetype,
        size: file.size,
        originalName: file.originalname
      };

      const uploadTask = await uploadBytesResumable(storageRef, file.buffer, metadata);
      const downloadURL = await getDownloadURL(uploadTask.ref);
      
      return {
        originalName: file.originalname,
        url: downloadURL,
        size: file.size,
        type: file.mimetype
      };
    });

    const uploadedFiles = await Promise.all(uploadPromises);

    res.status(200).json({ 
      message: 'Archivos subidos exitosamente',
      uploadedFiles 
    });

  } catch (error) {
    console.error('Error al subir archivos:', error);
    
    if (error.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({ 
        error: `El tamaño del archivo excede el límite de ${FILE_LIMITS.maxFileSize / (1024 * 1024)}MB` 
      });
    }
    
    if (error.code === 'LIMIT_FILE_COUNT') {
      return res.status(400).json({ 
        error: `Número máximo de archivos excedido (${FILE_LIMITS.maxFiles})` 
      });
    }

    res.status(500).json({ 
      error: 'Error al procesar la carga de archivos' 
    });
  }
});


// Más rutas (ejemplo: CRUD de libros, autenticación, búsqueda)
app.get('/api/read/books', async (req, res) => {
  try {
    const booksCol = collection(db, 'books');
    const booksSnapshot = await getDocs(booksCol);
    const booksList = booksSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    res.status(200).json(booksList);
  } catch (error) {
    console.error('Error al obtener libros:', error);
    res.status(500).json({ error: 'Error al obtener la lista de libros' });
  }
});


app.get('/api/read/book/:bookId', async (req, res) => {
  try {
    // Validar y sanitizar el ID del libro
    const bookId = req.params.bookId.trim();

    // Validar formato del ID (por ejemplo, alfanumérico de 20-30 caracteres)
    if (!validateUID(bookId)) {
      return res.status(400).json({ error: 'El ID del libro es inválido' });
    }

    // Referencia al libro en Firestore
    const bookRef = doc(db, 'books', bookId);
    const bookDoc = await getDoc(bookRef);

    if (bookDoc.exists()) {
      // Sanitizar los datos del libro antes de enviarlos al cliente
      const bookData = {
        id: bookDoc.id,
        ...sanitizeInput(bookDoc.data()), // Sanitización de datos
      };
      res.status(200).json(bookData);
    } else {
      // Si el libro no existe, responder con 404
      res.status(404).json({ error: 'El libro no existe' });
    }
  } catch (error) {
    // Manejo de errores seguro
    console.error('Error al obtener el libro por ID:', error.message);
    res.status(500).json({ error: 'No se pudo obtener el libro' });
  }
});

app.get('/api/read/books/:limit', async (req, res) => {
  try {
    // Validar y sanitizar el parámetro `limit`
    let limitParam = sanitizeInput(req.params.limit);

    // Convertir a número y establecer límites
    limitParam = parseInt(limitParam, 10);
    if (isNaN(limitParam) || limitParam <= 0) {
      limitParam = 5; // Valor predeterminado
    }
    if (limitParam > 100) {
      limitParam = 100; // Límite máximo
    }

    // Obtener la colección de libros con el límite especificado
    const booksCol = collection(db, 'books');
    const querySnapshot = await getDocs(query(booksCol, limit(limitParam)));

    // Construir la lista de libros sanitizados
    const booksList = [];
    querySnapshot.forEach((doc) => {
      booksList.push({
        id: sanitizeInput(doc.id), // Sanitizar el ID del libro
        ...sanitizeInput(doc.data()), // Sanitizar los datos del libro
      });
    });

    // Enviar la lista de libros al cliente
    res.status(200).json(booksList);
  } catch (error) {
    // Manejo de errores seguro
    console.error('Error al obtener la lista de libros:', error.message);
    res.status(500).json({ error: 'No se pudo obtener la lista de libros' });
  }
});

app.get('/api/search/books', async (req, res) => {
  try {
    // Validar y sanitizar el parámetro "title"
    const { title } = req.query;

    if (!title) {
      return res.status(400).json({ error: 'El parámetro "title" es requerido' });
    }

    const searchText = sanitizeInput(title).toLowerCase().trim();

    if (searchText.length < 3) {
      return res.status(400).json({ error: 'El parámetro "title" debe tener al menos 3 caracteres' });
    }

    // Obtener todos los libros de Firebase
    const booksRef = collection(db, 'books');
    const querySnapshot = await getDocs(booksRef);

    // Buscar coincidencias sanitizando los títulos en la base de datos
    const matchingBooks = [];
    querySnapshot.forEach((doc) => {
      const bookData = sanitizeInput(doc.data());
      const bookTitle = bookData.title?.toLowerCase() || '';

      if (bookTitle.includes(searchText)) {
        matchingBooks.push({ id: doc.id, ...bookData });
      }
    });

    // Enviar respuesta
    if (matchingBooks.length === 0) {
      return res.status(404).json({ message: 'No se encontraron libros con el título proporcionado.' });
    }

    return res.status(200).json(matchingBooks);
  } catch (error) {
    console.error('Error al buscar libros:', error);
    return res.status(500).json({ error: 'Hubo un error al buscar libros' });
  }
});


// Ruta protegida que requiere autenticación
app.get('/api/isAuth', isAuthenticated, (req, res) => {
  res.status(200);
})
app.get('/api/read/book/auth/:userID', isAuthenticated, async (req, res) => {
  try {
    // Validar y sanitizar el userID
    const userID = req.params.userID;
    try {
      validateUID(userID); // Validar formato de userID
    } catch (error) {
      return res.status(400).json({ error: 'userID inválido: ' + error.message });
    }

    // Consultar libros en la colección con el userID validado
    const booksCol = collection(db, 'books');
    const querySnapshot = await getDocs(query(booksCol, where('userID', '==', userID)));

    // Crear lista de libros sanitizando los datos
    const booksList = [];
    querySnapshot.forEach((doc) => {
      const sanitizedData = sanitizeInput(doc.data());
      booksList.push({
        id: doc.id,
        ...sanitizedData,
      });
    });

    // Responder con los libros encontrados
    return res.status(200).json(booksList);
  } catch (error) {
    // Manejo de errores
    console.error('Error al obtener la lista de libros para el usuario:', error);
    return res.status(500).json({ error: 'Error al obtener la lista de libros para el usuario' });
  }
});


app.post('/api/register', async (req, res) => {
  try {
    // Sanitizar y validar los datos de entrada
    const sanitizedBody = sanitizeInput(req.body);
    const { email, password, phone, name } = sanitizedBody;

    // Función mejorada de validación de email
    function isValidEmail(email) {
      if (!email || typeof email !== 'string') {
        return false;
      }
      if (email.length > 254) { // RFC 5321
        return false;
      }
      const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
      return emailRegex.test(email);
    }

    // Función de validación de teléfono mejorada
    function isValidPhone(phone) {
      if (!phone || typeof phone !== 'string') {
        return false;
      }
      // Regex más específica para teléfonos
      const phoneRegex = /^[+]?[\d]{9,15}$/;
      return phoneRegex.test(phone);
    }

    // Función de validación de nombre
    function isValidName(name) {
      if (!name || typeof name !== 'string') {
        return false;
      }
      const trimmedName = name.trim();
      return trimmedName.length >= 3 && trimmedName.length <= 50;
    }

    // Validaciones mejoradas
    if (!isValidEmail(email)) {
      return res.status(400).json({ error: 'Formato de correo electrónico inválido' });
    }

    if (!password || typeof password !== 'string') {
      return res.status(400).json({ error: 'Formato de contraseña inválido' });
    }

    if (password.length < 6 || password.length > 128) {
      return res.status(400).json({ 
        error: 'La contraseña debe tener entre 6 y 128 caracteres' 
      });
    }

    if (!isValidPhone(phone)) {
      return res.status(400).json({ 
        error: 'Formato de teléfono inválido' 
      });
    }

    if (!isValidName(name)) {
      return res.status(400).json({ 
        error: 'El nombre debe tener entre 3 y 50 caracteres' 
      });
    }

    // Crear usuario con correo y contraseña
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const uid = userCredential.user.uid;

    // Validar UID
    if (!uid || typeof uid !== 'string' || uid.length < 1) {
      throw new Error('UID inválido generado');
    }

    // Guardar información en Firestore con datos sanitizados
    await addDoc(collection(db, 'users'), {
      uid,
      phone: sanitizeInput(phone),
      name: sanitizeInput(name.trim()),
      email: sanitizeInput(email.toLowerCase()),
      createdAt: new Date().toISOString()
    });

    return res.status(201).json({ 
      message: 'Registro exitoso',
      uid 
    });

  } catch (error) {
    console.error('Error en registro:', error.message);

    // Manejo específico de errores
    const errorResponses = {
      'auth/email-already-in-use': { 
        status: 409, 
        message: 'El correo electrónico ya está registrado' 
      },
      'auth/invalid-email': { 
        status: 400, 
        message: 'Correo electrónico inválido' 
      },
      'auth/operation-not-allowed': { 
        status: 403, 
        message: 'Operación no permitida' 
      },
      'auth/weak-password': { 
        status: 400, 
        message: 'La contraseña es demasiado débil' 
      }
    };

    const errorResponse = errorResponses[error.code] || 
      { status: 500, message: 'Error en el registro' };

    return res.status(errorResponse.status).json({ 
      error: errorResponse.message 
    });
  }
});


// Ruta para el endpoint de inicio de sesión
app.post('/api/login', async (req, res) => {
  try {
    // Sanitizar y validar los datos de entrada
    const sanitizedBody = sanitizeInput(req.body);
    const { email, password } = sanitizedBody;

    // Función mejorada de validación de email
    function isValidEmail(email) {
      if (!email || typeof email !== 'string') {
        return false;
      }
      // Limitar longitud según RFC 5321
      if (email.length > 254) {
        return false;
      }
      // Regex más segura y específica para emails
      const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
      return emailRegex.test(email);
    }

    if (!isValidEmail(email)) {
      return res.status(400).json({ error: 'Correo electrónico inválido' });
    }

    // Validación mejorada de contraseña
    if (!password || typeof password !== 'string') {
      return res.status(400).json({ error: 'Formato de contraseña inválido' });
    }

    // Validación de longitud y complejidad de contraseña
    if (password.length < 6 || password.length > 128) {
      return res.status(400).json({ 
        error: 'La contraseña debe tener entre 6 y 128 caracteres' 
      });
    }

    // Iniciar sesión con correo y contraseña
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // Generar y encriptar el token de usuario
    const idToken = await auth.currentUser.getIdToken();
    const encryptedToken = encryptToken(idToken);

    // Implementar rate limiting aquí si es necesario
    
    return res.status(200).json({
      isAuthorized: true,
      userID: user.uid,
      idToken: encryptedToken
    });
  } catch (error) {
    console.error('Error al iniciar sesión:', error.message);

    // Sanitizar el email antes de registrarlo
    const sanitizedEmail = sanitizeInput(req.body.email);

    // Registrar intentos fallidos con información sanitizada
    if (error.code === 'auth/wrong-password' || error.code === 'auth/invalid-email') {
      await logCriticalEvent(
        'LOGIN_FAILURE',
        `Intento fallido de inicio de sesión`,
        { 
          email: sanitizedEmail, 
          errorCode: error.code,
          timestamp: new Date().toISOString()
        }
      );
    }

    // Manejar errores específicos
    const errorResponses = {
      'auth/wrong-password': { status: 401, message: 'Credenciales inválidas' },
      'auth/user-not-found': { status: 404, message: 'Usuario no encontrado' },
      'auth/invalid-email': { status: 400, message: 'Correo electrónico inválido' },
      'auth/too-many-requests': { status: 429, message: 'Demasiados intentos. Intente más tarde' }
    };

    const errorResponse = errorResponses[error.code] || 
      { status: 500, message: 'Error interno del servidor' };

    return res.status(errorResponse.status).json({ 
      error: errorResponse.message 
    });
  }
});


app.post('/api/logout', isAuthenticated, async (req, res) => {
  try {
    // Validar y sanitizar el userID
    const sanitizedBody = sanitizeInput(req.body);
    const { userID } = sanitizedBody;

    if (!userID) {
      return res.status(400).json({ error: 'El userID es requerido' });
    }

    try {
      validateUID(userID); // Validar el formato del userID
    } catch (error) {
      return res.status(400).json({ error: `userID inválido: ${error.message}` });
    }

    // Eliminar el token de actualización del usuario
    await removeRefreshToken(userID);

    console.log("Usuario cerrado sesión con éxito");
    return res.status(200).json({ message: "Usuario cerrado sesión con éxito" });
  } catch (error) {
    console.error("Error durante el cierre de sesión:", error.message);
    return res.status(500).json({ error: "Error al cerrar sesión" });
  }
});


app.post('/api/user/reset-password', async (req, res) => {
  try {
    // Sanitizar y validar el correo electrónico
    const sanitizedBody = sanitizeInput(req.body);
    const { email } = sanitizedBody;

    // Función mejorada de validación de email
    function isValidEmail(email) {
      if (!email || typeof email !== 'string') {
        return false;
      }
      // Limitar longitud según RFC 5321
      if (email.length > 254) {
        return false;
      }
      // Regex más segura y específica para emails
      const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
      return emailRegex.test(email);
    }

    if (!isValidEmail(email)) {
      return res.status(400).json({ 
        error: 'Formato de correo electrónico inválido' 
      });
    }

    // Implementar rate limiting aquí
   /*  const rateLimitResult = await checkRateLimit(email);
     if (rateLimitResult.limited) {
       return res.status(429).json({ 
         error: 'Demasiadas solicitudes. Intente más tarde.' 
       });
     } */

    // Enviar correo de recuperación de contraseña
    await sendPasswordResetEmail(auth, email.toLowerCase());

    // Log seguro sin exponer el email completo

    function maskEmail(email) {
      if (!email || typeof email !== 'string') return '';
      
      const [localPart, domain] = email.split('@');
      if (!domain) return email;
  
      // Mantener los primeros 3 caracteres, reemplazar el resto con asteriscos
      const maskedLocal = localPart.slice(0, 3) + '*'.repeat(Math.max(0, localPart.length - 3));
      
      return `${maskedLocal}@${domain}`;
  }
  
  const maskedEmail = maskEmail(email);
  console.log('Correo de recuperación enviado a:', maskedEmail);

    // Respuesta genérica por seguridad
    return res.status(200).json({ 
      message: 'Si el correo existe en nuestro sistema, recibirá instrucciones para restablecer su contraseña' 
    });

  } catch (error) {
    // Log seguro del error
    console.error('Error en restablecimiento de contraseña:', {
      errorCode: error.code,
      errorMessage: error.message,
      timestamp: new Date().toISOString()
    });

    // Manejo específico de errores
    const errorResponses = {
      'auth/user-not-found': {
        status: 200, // Usar 200 por seguridad
        message: 'Si el correo existe en nuestro sistema, recibirá instrucciones para restablecer su contraseña'
      },
      'auth/invalid-email': {
        status: 400,
        message: 'Formato de correo electrónico inválido'
      },
      'auth/too-many-requests': {
        status: 429,
        message: 'Demasiadas solicitudes. Intente más tarde'
      }
    };

    const errorResponse = errorResponses[error.code] || {
      status: 500,
      message: 'Error en el proceso de restablecimiento'
    };

    return res.status(errorResponse.status).json({ 
      error: errorResponse.message 
    });
  }
});

app.delete('/api/delete/book/:bookId', isAuthenticated, async (req, res) => {
  try {
    // Validar y sanitizar el ID del libro
    const bookId = sanitizeInput(req.params.bookId);

    if (!bookId || typeof bookId !== 'string' || bookId.trim().length === 0) {
      return res.status(400).json({ error: 'ID del libro inválido' });
    }

    // Verificar si el libro existe antes de eliminarlo
    const bookRef = doc(db, 'books', bookId);
    const bookDoc = await getDoc(bookRef);

    if (!bookDoc.exists()) {
      return res.status(404).json({ error: 'El libro no existe' });
    }

    // Eliminar el libro
    await deleteDoc(bookRef);

    console.log('Libro eliminado exitosamente:', bookId);
    return res.status(200).json({ message: 'Libro eliminado exitosamente' });
  } catch (error) {
    console.error('Error al eliminar el libro:', error.message);

    // Registrar eventos críticos en caso de error
    await logCriticalEvent('DATABASE_ERROR', 'Error al eliminar un libro', {
      bookId: req.params.bookId,
      error: error.message,
    });

    // Responder con un mensaje genérico de error
    return res.status(500).json({ error: 'Hubo un error al eliminar el libro' });
  }
});


app.post('/api/create/book', isAuthenticated, async (req, res) => {
  try {
    // Sanitizar y validar los datos del libro
    const sanitizedBookData = sanitizeInput(req.body);

    // Crear el libro en la base de datos
    const newBookRef = await addDoc(collection(db, 'books'), sanitizedBookData)

    console.log('Libro creado exitosamente:', newBookRef.id);
    return res.status(201).json({ message: 'Libro creado exitosamente', bookId: newBookRef.id });
  } catch (error) {
    console.error('Error al crear el libro:', error);

    // Registrar evento crítico en caso de error
    await logCriticalEvent('DATABASE_ERROR', 'Error al crear un libro', {
      bookData: req.body,
      error: error.message,
    });

    return res.status(500).json({ error: 'Hubo un error al crear el libro' });
  }
});


// Ruta para actualizar un libro
app.put('/api/update/book/:bookId', isAuthenticated, async (req, res) => {
  try {
    // Validar y sanitizar el ID del libro
    const bookId = sanitizeInput(req.params.bookId);

    if (!bookId || typeof bookId !== 'string' || bookId.trim().length === 0) {
      return res.status(400).json({ error: 'ID del libro inválido' });
    }

    // Sanitizar y validar los datos del cuerpo de la solicitud
    const sanitizedData = sanitizeInput(req.body);
    const { title, author, genre, publishedYear } = sanitizedData;

    if (title && (typeof title !== 'string' || title.trim().length < 3)) {
      return res.status(400).json({ error: 'El título debe tener al menos 3 caracteres' });
    }

    if (author && (typeof author !== 'string' || author.trim().length < 3)) {
      return res.status(400).json({ error: 'El autor debe tener al menos 3 caracteres' });
    }

    if (genre && (typeof genre !== 'string' || genre.trim().length === 0)) {
      return res.status(400).json({ error: 'El género no puede estar vacío' });
    }

    if (
      publishedYear &&
      (typeof publishedYear !== 'number' || publishedYear < 1000 || publishedYear > new Date().getFullYear())
    ) {
      return res.status(400).json({ error: 'El año de publicación es inválido' });
    }

    // Verificar si el libro existe
    const bookRef = doc(db, 'books', bookId);
    const bookDoc = await getDoc(bookRef);

    if (!bookDoc.exists()) {
      return res.status(404).json({ error: 'El libro no existe' });
    }

    // Actualizar los datos del libro
    await updateDoc(bookRef, {
      ...(title && { title: title.trim() }),
      ...(author && { author: author.trim() }),
      ...(genre && { genre: genre.trim() }),
      ...(publishedYear && { publishedYear }),
      updatedAt: new Date().toISOString(),
    });

    console.log('Libro actualizado exitosamente:', bookId);
    return res.status(200).json({ message: 'Libro actualizado exitosamente' });
  } catch (error) {
    console.error('Error al actualizar el libro:', error);

    // Registrar evento crítico en caso de error
    await logCriticalEvent('DATABASE_ERROR', 'Error al actualizar un libro', {
      bookId: req.params.bookId,
      error: error.message,
    });

    return res.status(500).json({ error: 'Hubo un error al actualizar el libro' });
  }
});


app.post('/api/payment/confirm', isAuthenticated, async (req, res) => {
  try {
    // Sanitizar y validar los datos de entrada
    const sanitizedBody = sanitizeInput(req.body);
    const { orderID, bookId, userId } = sanitizedBody;

    if (!orderID || typeof orderID !== 'string') {
      return res.status(400).json({ error: 'ID de la orden es requerido y debe ser una cadena válida' });
    }

    if (!bookId || typeof bookId !== 'string') {
      return res.status(400).json({ error: 'ID del libro es requerido y debe ser una cadena válida' });
    }

    if (!userId || typeof userId !== 'string') {
      return res.status(400).json({ error: 'ID del usuario es requerido y debe ser una cadena válida' });
    }

    // Configuración de la API de PayPal
    const PAYPAL_API = 'https://api-m.sandbox.paypal.com'; // Cambia a la API de producción en despliegues reales
    const CLIENT_ID = process.env.PAYPAL_CLIENT_ID;
    const SECRET = process.env.PAYPAL_SECRET;

    if (!CLIENT_ID || !SECRET) {
      return res.status(500).json({ error: 'Credenciales de PayPal no configuradas' });
    }

    const auth = Buffer.from(`${CLIENT_ID}:${SECRET}`).toString('base64');

    // Obtener el token de acceso de PayPal
    const tokenResponse = await fetch(`${PAYPAL_API}/v1/oauth2/token`, {
      method: 'POST',
      headers: {
        Authorization: `Basic ${auth}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: 'grant_type=client_credentials',
    });

    const tokenData = await tokenResponse.json();

    if (!tokenResponse.ok) {
      return res.status(500).json({ error: 'No se pudo obtener el token de acceso de PayPal', details: tokenData });
    }

    // Verificar la orden con PayPal
    const orderResponse = await fetch(`${PAYPAL_API}/v2/checkout/orders/${orderID}`, {
      headers: {
        Authorization: `Bearer ${tokenData.access_token}`,
      },
    });

    const orderData = await orderResponse.json();

    if (!orderResponse.ok || !orderData || orderData.status !== 'COMPLETED') {
      return res.status(400).json({ error: 'La orden no está completada o es inválida', details: orderData });
    }

    // Preparar los datos de la orden para Firestore
    const purchaseDate = new Date().toISOString();
    const orderDetails = {
      orderId: orderID,
      userId: userId,
      bookId: bookId,
      amount: orderData.purchase_units[0].amount.value,
      currency: orderData.purchase_units[0].amount.currency_code,
      status: orderData.status,
      payer: {
        name: `${orderData.payer.name.given_name} ${orderData.payer.name.surname}`,
        email: orderData.payer.email_address,
      },
      purchaseDate,
    };

    // Guardar la orden en Firestore
    const newOrderRef = await addDoc(collection(db, 'orders'), orderDetails);

    console.log('Pago confirmado y orden guardada exitosamente:', newOrderRef.id);
    return res.status(201).json({
      success: true,
      message: 'Pago confirmado y orden guardada exitosamente',
      orderId: newOrderRef.id,
    });
  } catch (error) {
    console.error('Error al confirmar la orden con PayPal:', error);
    return res.status(500).json({
      error: 'Error interno del servidor',
      details: error.message,
    });
  }
});


app.get('/api/read/orders/auth/:userID', isAuthenticated, async (req, res) => {
  try {
    // Validar y sanitizar el ID del usuario
    const userID = sanitizeInput(req.params.userID);

    if (!userID || typeof userID !== 'string' || userID.trim().length === 0) {
      return res.status(400).json({ error: 'ID del usuario inválido' });
    }

    // Referencia a la colección 'orders' y consulta filtrada por 'userId'
    const ordersCol = collection(db, 'orders');
    const querySnapshot = await getDocs(query(ordersCol, where('userId', '==', userID)));

    // Construir la lista de órdenes
    const ordersList = [];
    querySnapshot.forEach((doc) => {
      const sanitizedOrder = sanitizeInput(doc.data());
      ordersList.push({
        id: doc.id, // Incluir el ID del documento
        ...sanitizedOrder, // Agregar los datos sanitizados del documento
      });
    });

    // Verificar si no hay órdenes
    if (ordersList.length === 0) {
      return res.status(404).json({ message: 'No se encontraron órdenes para el usuario especificado' });
    }

    return res.status(200).json(ordersList); // Responder con la lista de órdenes
  } catch (error) {
    console.error('Error obteniendo las órdenes para el usuario:', error);

    // Manejo de errores con registro detallado
    await logCriticalEvent('DATABASE_ERROR', 'Error al leer órdenes', {
      userId: req.params.userID,
      error: error.message,
    });

    return res.status(500).json({ error: 'Error obteniendo las órdenes para el usuario' });
  }
});


app.get('/api/admin/logs', isAuthenticated, checkAdmin, async (req, res) => {
  try {
    // Validar y sanitizar los parámetros de consulta
    const { limit: limitParam = 10, page = 1 } = sanitizeInput(req.query);
    const parsedLimit = parseInt(limitParam, 10);
    const parsedPage = parseInt(page, 10);

    if (!Number.isInteger(parsedLimit) || parsedLimit < 1) {
      return res.status(400).json({ error: 'El parámetro "limit" debe ser un número entero mayor que 0' });
    }

    if (!Number.isInteger(parsedPage) || parsedPage < 1) {
      return res.status(400).json({ error: 'El parámetro "page" debe ser un número entero mayor que 0' });
    }

    // Referencia a la colección de logs
    const logsCol = collection(db, 'logs');

    // Configuración base de la consulta con orden y límite
    const baseQuery = query(logsCol, orderBy('timestamp', 'desc'), limit(parsedLimit));

    // Determinar el punto de inicio para la paginación
    let startAtSnapshot = null;
    if (parsedPage > 1) {
      const offsetQuery = query(logsCol, orderBy('timestamp', 'desc'), limit((parsedPage - 1) * parsedLimit));
      const offsetSnapshot = await getDocs(offsetQuery);
      const offsetDocs = offsetSnapshot.docs;

      if (offsetDocs.length > 0) {
        startAtSnapshot = offsetDocs[offsetDocs.length - 1];
      }
    }

    // Aplicar la paginación final
    const finalQuery = startAtSnapshot ? query(baseQuery, startAfter(startAtSnapshot)) : baseQuery;
    const logsSnapshot = await getDocs(finalQuery);

    // Construir la lista de logs
    const logs = logsSnapshot.docs.map((doc) => ({
      id: doc.id,
      ...sanitizeInput(doc.data()),
    }));

    // Obtener el total de registros
    const totalSnapshot = await getDocs(logsCol);
    const totalCount = totalSnapshot.size;
    const totalPages = Math.ceil(totalCount / parsedLimit);

    // Responder con los logs y los metadatos
    return res.status(200).json({
      logs,
      metadata: {
        currentPage: parsedPage,
        totalPages,
        totalCount,
      },
    });
  } catch (error) {
    console.error('Error al obtener los logs:', error);

    // Respuesta de error
    return res.status(500).json({ error: 'Error al obtener los logs' });
  }
});

app.get('/api/admin/critical-logs', isAuthenticated, checkAdmin, async (req, res) => {
  try {
    // Sanitizar y validar los parámetros de consulta
    const { limit: limitParam = 10, page = 1 } = sanitizeInput(req.query);
    const parsedLimit = parseInt(limitParam, 10);
    const parsedPage = parseInt(page, 10);

    if (!Number.isInteger(parsedLimit) || parsedLimit < 1) {
      return res.status(400).json({ error: 'El parámetro "limit" debe ser un número entero mayor que 0' });
    }

    if (!Number.isInteger(parsedPage) || parsedPage < 1) {
      return res.status(400).json({ error: 'El parámetro "page" debe ser un número entero mayor que 0' });
    }

    // Referencia a la colección de logs críticos
    const criticalLogsCol = collection(db, 'critical_logs');

    // Configuración base de la consulta con orden y límite
    const baseQuery = query(criticalLogsCol, orderBy('timestamp', 'desc'), limit(parsedLimit));

    // Determinar el punto de inicio para la paginación
    let startAtSnapshot = null;
    if (parsedPage > 1) {
      const offsetQuery = query(criticalLogsCol, orderBy('timestamp', 'desc'), limit((parsedPage - 1) * parsedLimit));
      const offsetSnapshot = await getDocs(offsetQuery);
      const offsetDocs = offsetSnapshot.docs;

      if (offsetDocs.length > 0) {
        startAtSnapshot = offsetDocs[offsetDocs.length - 1];
      }
    }

    // Aplicar la paginación final
    const finalQuery = startAtSnapshot ? query(baseQuery, startAfter(startAtSnapshot)) : baseQuery;
    const criticalLogsSnapshot = await getDocs(finalQuery);

    // Construir la lista de logs críticos
    const criticalLogs = criticalLogsSnapshot.docs.map((doc) => ({
      id: doc.id,
      ...sanitizeInput(doc.data()),
    }));

    // Obtener el total de registros de logs críticos
    const totalSnapshot = await getDocs(criticalLogsCol);
    const totalCount = totalSnapshot.size;
    const totalPages = Math.ceil(totalCount / parsedLimit);

    // Responder con los logs críticos y metadatos de paginación
    return res.status(200).json({
      criticalLogs,
      metadata: {
        currentPage: parsedPage,
        totalPages,
        totalCount,
      },
    });
  } catch (error) {
    console.error('Error al obtener los logs críticos:', error);

    // Responder con error en caso de fallo
    return res.status(500).json({ error: 'Error al obtener los logs críticos' });
  }
});


// Configuración del servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor iniciado en el puerto ${PORT}`);
});
