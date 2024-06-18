//Entranamiendo de las api
// Cambiar de esto
// Importación de módulos
const express = require('express')
const cors = require('cors')
const { initializeApp } = require('firebase/app')
const { getFirestore, updateDoc, collection, query, limit, getDocs, where, getDoc, addDoc, doc, deleteDoc } = require('firebase/firestore')
const { getAuth, sendPasswordResetEmail, createUserWithEmailAndPassword, signInWithEmailAndPassword } = require("firebase/auth")
const multer = require('multer');
const { getStorage, ref, uploadBytesResumable, getDownloadURL } = require("firebase/storage");
const isAuthenticated = require('../firebaseAuthentication')
const firebaseConfig = require('../firebaseConfig')
require('dotenv').config()
const { v4 } = require('uuid')
const WebSocket = require('ws');
const https = require('https');
const fs = require('fs');
const jwt = require('jsonwebtoken');


const app = express()
app.use(express.json())
app.use(cors())

const server = https.createServer({
  cert: fs.readFileSync('katukamu_cert.pem'),
  key: fs.readFileSync('katukamu_key.pem')
}, app);

const wss = new WebSocket.Server({ server: server, path: '/ws' });

// aquí iniciamos la conexión con firebase
const appFirebase = initializeApp(firebaseConfig)
const auth = getAuth(appFirebase)
const db = getFirestore(appFirebase)
const firebaseStorage = getStorage(appFirebase)
const storage = multer.memoryStorage()
const upload = multer({ storage: storage })


app.get('/api', (req, res) => {
  const path = `/api/item/${v4()}`
  res.setHeader('Content-Type', 'text/html')
  res.setHeader('Cache-Control', 's-max-age=1, stale-while-revalidate')
  res.end(`Hello! Go to item: <a href="${path}">${path}</a>`)
})

app.get('/api/item/:slug', (req, res) => {
  const { slug } = req.params
  res.end(`Item: ${slug}`)
})

/* Rutas de la API */
// Ruta para subir un archivo
app.post('/upload', upload.single('file'), async (req, res) => {
  // Ruta para cargar archivos en Firebase Storage
  try {
    const file = req.file
    if (!file) {
      return res.status(400).send('No se ha proporcionado un archivo.');
    }
    const storageRef = ref(firebaseStorage, `/files/${file.originalname}`);
    const uploadTask = await uploadBytesResumable(storageRef, file.buffer);
    const downloadURL = await getDownloadURL(uploadTask.ref);
    console.log("downloadURL:", downloadURL);
    return res.status(200).send({ url: downloadURL });
  } catch (error) {
    // No se pudo subir el archivo
    console.error(error);
    res.status(500).send('Error al subir el archivo.');
  }
});

// Obtener todos los libros

//Aquí generamos solicitudes con la API
app.get('/api/read/books', async (req, res) => {
  try {
    const booksCol = collection(db, 'books')
    const booksSnapshot = await getDocs(booksCol)
    const booksList = []

    booksSnapshot.forEach((doc) => {
      booksList.push({
        id: doc.id,
        ...doc.data()
      })
    })

    res.status(200).json(booksList)
  } catch (error) {
    // No se pudo obtener la lista de libros
    console.error('Error getting the books list', error)
    res.status(500).json({ error: 'Error getting the books list' })
  }
})

// Obtener un libro por su ID
app.get('/api/read/book/:bookId', async (req, res) => {
  try {
    const bookId = req.params.bookId

    // Capturamos cada libro por la ida
    const bookRef = doc(db, 'books', bookId)
    const bookDoc = await getDoc(bookRef)

    if (bookDoc.exists()) {
      // Si el libro existe, devolverlo como respuesta
      const bookData = {
        id: bookDoc.id,
        ...bookDoc.data()
      }
      res.status(200).json(bookData)
    } else {
      // Si el libro no existe, responder con un código de estado 404 (No encontrado)
      res.status(404).json({ error: 'El libro no existe' })
    }
  } catch (error) {
    // No se pudo obtener el libro por su ID
    console.error('Error getting the book by ID', error)
    res.status(500).json({ error: 'Error getting the book by ID' })
  }
})

app.get('/api/read/books/:limit', async (req, res) => {
  try {
    const limitParam = parseInt(req.params.limit, 10) || 5 // Obtener el límite de la URL, o utilizar 5 como valor predeterminado si no se proporciona.
    const booksCol = collection(db, 'books')
    const querySnapshot = await getDocs(query(booksCol, limit(limitParam)))
    const booksList = []
    querySnapshot.forEach((doc) => {
      booksList.push({
        id: doc.id,
        ...doc.data()
      })
    })
    res.status(200).json(booksList)

  } catch (error) {
    // No se pudo obtener la lista de libros
    console.error('Error getting the books list', error)
    res.status(500).json({ error: 'Error getting the books list' })
  }
})

// Ruta para buscar libros por título o parte del título
app.get('/api/search/books', async (req, res) => {
  try {
    const searchText = req.query.title.toLowerCase() // Convertir la consulta a minúsculas

    // Realizar la búsqueda en la base de datos de Firebase
    const booksRef = collection(db, 'books')
    const querySnapshot = await getDocs(booksRef)

    const matchingBooks = []
    querySnapshot.forEach((doc) => {
      const title = doc.data().title.toLowerCase() // Convertir el título de la base de datos a minúsculas
      if (title.includes(searchText)) {
        // Agregar los libros coincidentes a la lista
        matchingBooks.push({ id: doc.id, ...doc.data() })
      }
    })

    res.status(200).json(matchingBooks)
  } catch (error) {
    // No se pudo buscar libros
    console.error('Error al buscar libros:', error)
    res.status(500).json({ error: 'Hubo un error al buscar libros', errorFire: error })
  }
})

// Ruta protegida que requiere autenticación
app.get('/api/isAuth', isAuthenticated, (req, res) => {
  const userId = req.user.uid
  res.json({ message: `Usuario autenticado con ID: ${userId}` })
})

app.get('/api/read/book/auth/:userID', isAuthenticated, async (req, res) => {
  try {
    const userID = req.params.userID
    console.log(userID)
    const booksCol = collection(db, 'books')
    const querySnapshot = await getDocs(query(booksCol, where('userID', '==', userID)))
    const booksList = []
    querySnapshot.forEach((doc) => {
      booksList.push({
        id: doc.id,
        ...doc.data()
      })
    })

    res.status(200).json(booksList)
  } catch (error) {
    // No se pudo obtener la lista de libros para el usuario
    console.error('Error getting the books list for user', error)
    res.status(500).json({ error: 'Error getting the books list for user' })
  }
})

// Ruta para el endpoint de registro de usuario
app.post('/api/register', async (req, res) => {
  const { email, password, phone, name } = req.body
  try {
    // Crear usuario con correo y contraseña en Firebase Authentication
    const userCredential = await createUserWithEmailAndPassword(auth, email, password)
    const uid = userCredential.user.uid
    // Guardar información adicional en Firestore
    await addDoc(collection(db, 'users'), {
      uid: uid,
      phone: phone,
      name: name
    })

    res.status(200).json({ message: 'Registro exitoso' })
  } catch (error) {
    // No se pudo registrar el usuario
    console.error('Error al registrarse:', error.message)
    // Manejar errores y enviar una respuesta de error
    res.status(500).json({ error: error.message })
  }
})

// Ruta para el endpoint de inicio de sesión
app.post('/api/login', async (req, res) => {
  const { email, password } = req.body
  try {
    // Iniciar sesión con correo y contraseña
    const userCredential = await signInWithEmailAndPassword(auth, email, password)
    console.log(await auth.currentUser.getIdToken())
    const user = userCredential.user
    // Inicio de sesión exitoso, puedes hacer lo que necesites aquí

    res.status(200).json({ isAuthorized: true, userID: user.uid, idToken: await auth.currentUser.getIdToken() })

  } catch (error) {
    console.error('Error al iniciar sesión:', error.message)
    // Manejar errores y enviar una respuesta de error
    res.status(500).json({ error: error.message })
  }
})

// Ruta para envio de correo de recuperacion de contraseña
app.post('/api/user/reset-password', async (req, res) => {
  const { email } = req.body
  try {
    const resetPassword = await sendPasswordResetEmail(auth, email)
    console.log(resetPassword)
    res.status(200).json({ message: "Correo enviado exitosamete" })
  } catch (error) {
    // No se pudo enviar el correo de restablecimiento de contraseña
    console.error('Error al enviar el correo de restablecimiento de contraseña:', error)
    // Manejar errores y enviar una respuesta de error
    res.status(500).json({ error: error.message })
  }
})

// Ruta para borrado de un libro
app.delete('/api/delete/book/:bookId', isAuthenticated, async (req, res) => {
  try {
    const bookId = req.params.bookId
    // Verifica si el libro existe antes de eliminarlo
    const bookRef = doc(db, 'books', bookId)
    const bookDoc = await getDoc(bookRef)

    if (!bookDoc.exists()) {
      return res.status(404).json({ error: 'El libro no existe' })
    }

    // Elimina el libro
    await deleteDoc(bookRef)
    res.status(200).json({ message: 'Libro eliminado exitosamente' })
  } catch (error) {
    // No se pudo eliminar el libro
    console.error('Error al eliminar el libro:', error)
    res.status(500).json({ error: 'Hubo un error al eliminar el libro', errorFire: error })
  }
})

//Crear un libro
app.post('/api/create/book', isAuthenticated, async (req, res) => {
  try {
    const bookData = req.body
    console.log(bookData)
    const newBookRef = await addDoc(collection(db, 'books'), bookData)
    res.status(201).json({ message: 'Libro creado exitosamente', bookId: newBookRef.id })
  } catch (error) {
    // No se pudo crear el libro
    console.error('Error al crear el libro:', error)
    res.status(500).json({ error: 'Hubo un error al crear el libro', errorFire: error })
  }
})

// Ruta para actualizar un libro
app.put('/api/update/book/:bookId', isAuthenticated, async (req, res) => {
  try {
    const bookId = req.params.bookId
    const updatedData = req.body // Los datos actualizados del libro deben estar en el cuerpo de la solicitud

    // Verifica si el libro existe antes de actualizarlo
    const bookRef = doc(db, 'books', bookId)
    const bookDoc = await getDoc(bookRef)

    if (!bookDoc.exists()) {
      return res.status(404).json({ error: 'El libro no existe' })
    }
    // Actualiza los datos del libro en la base de datos
    await updateDoc(bookRef, updatedData)
    res.status(200).json({ message: 'Libro actualizado exitosamente' })
  } catch (error) {
    // No se pudo actualizar el libro
    console.error('Error al actualizar el libro:', error)
    res.status(500).json({ error: 'Hubo un error al actualizar el libro', errorFire: error })
  }
})

//####################################################################
//####################################################################

// Obtener todos los usuarios
app.get('/api/read/users', async (req, res) => {
  try {
    // Referencia a la colección 'users'
    const usersCol = collection(db, 'usersjwt');
    // Obtener todos los documentos de la colección 'users'
    const usersSnapshot = await getDocs(usersCol);
    // Lista para almacenar los usuarios
    const usersList = [];

    // Iterar sobre cada documento en la colección
    usersSnapshot.forEach((doc) => {
      // Agregar cada usuario a la lista
      usersList.push({
        id: doc.id,
        ...doc.data()
      });
    });

    // Devolver la lista de usuarios en la respuesta
    res.status(200).json(usersList);
  } catch (error) {
    // Manejo de errores
    console.error('Error getting the users list', error);
    res.status(500).json({ error: 'Error getting the users list' });
  }
});


const jwtSecret = process.env.JWT_SECRET


app.post('/api/loginjwt', async (req, res) => {
  const { email, password } = req.body;

  try {
    // Realiza una solicitud a /api/read/users para obtener la lista de usuarios
    const response = await fetch(`http://localhost:${PORT}/api/read/users`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      throw new Error('Error al obtener la lista de usuarios');
    }

    const usersList = await response.json();

    // Buscar el usuario en la lista de usuarios
    const user = usersList.find(user => user.email === email);

    if (!user) {
      return res.status(401).json({ error: 'Email inválidas' });
    }

    // Comparar la contraseña usando bcrypt
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({ error: 'Credenciales inválidas' });
    }

    // Generar JWT
    const token = jwt.sign(
      {
        uid: user.id,
        email: user.email
      },
      jwtSecret,
      { expiresIn: '1h' } // Token expira en 1 hora
    );

    // Devolver el token y la información del usuario
    res.status(200).json({
      message: 'Autenticación exitosa',
      token,
      user: {
        uid: user.id,
        email: user.email
      }
    });

    /*res.cookie('access_token', token, {
      httpOnly: true, // la cookie solo se puede acceder en el servidor
      secure: process.env.NODE_ENV === 'production', // la cookie solo se puede acceder a través de HTTPS en producción
      sameSite: 'strict', // la cookie solo se puede acceder en el mismo dominio
      maxAge: 1000 * 60 * 60 // la cookie tiene un tiempo de validez de 1 hora
    })
    .send({ user, token });*/

  } catch (error) {
    console.error('Error al iniciar sesión:', error.message);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});


// Inicio del servidor
const PORT = process.env.PORT || 3000
server.listen(PORT, () => {
  console.log(`Servidor iniciado en el puerto ${PORT}`)
})
