// Importación de módulos
const express = require('express');
const fetch = require('node-fetch');
const cors = require('cors');
const { initializeApp } = require('firebase/app');
const { getFirestore, updateDoc, collection, query, limit, getDocs, where, getDoc, addDoc, doc, deleteDoc } = require('firebase/firestore');
const { getAuth, sendPasswordResetEmail, createUserWithEmailAndPassword, signInWithEmailAndPassword } = require("firebase/auth");
const multer = require('multer');
const { getStorage, ref, uploadBytesResumable, getDownloadURL } = require("firebase/storage");
const isAuthenticated = require('../firebaseAuthentication');
const firebaseConfig = require('../firebaseConfig');
require('dotenv').config();

// Inicialización de Firebase
const appFirebase = initializeApp(firebaseConfig);
const auth = getAuth(appFirebase);
const db = getFirestore(appFirebase);
const firebaseStorage = getStorage(appFirebase);
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// Creación de una instancia en Express
const app = express();
app.use(express.json());
app.use(cors());

// Ruta básica de prueba
app.get('/api', (req, res) => {
  const path = `/api/item/${require('uuid').v4()}`;
  res.setHeader('Content-Type', 'text/html');
  res.setHeader('Cache-Control', 's-max-age=1, stale-while-revalidate');
  res.send(`Hello! Go to item: <a href="${path}">${path}</a>`);
});

// Rutas de API (subida de archivo, lectura de libros, autenticación, etc.)
app.post('/api/upload', upload.single('file'), async (req, res) => {
  try {
    const file = req.file;
    if (!file) {
      return res.status(400).send('No se ha proporcionado un archivo.');
    }
    const storageRef = ref(firebaseStorage, `/files/${file.originalname}`);
    const uploadTask = await uploadBytesResumable(storageRef, file.buffer);
    const downloadURL = await getDownloadURL(uploadTask.ref);
    res.status(200).send({ url: downloadURL });
  } catch (error) {
    console.error('Error al subir archivo:', error);
    res.status(500).send('Error al subir el archivo.');
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
      const user = userCredential.user
      const useruid = user.uid
      let fullName = "";
      try {
        const usersCol = collection(db, 'users');
        const userQuery = query(usersCol, where('uid', '==', useruid));
        const querySnapshot = await getDocs(userQuery);
  
        if (querySnapshot.empty) {
          return res.status(404).json({ error: 'User not found' });
        }
        const userData = querySnapshot.docs[0].data();
        fullName = userData.name;
        
      } catch (error) {
        // No se pudo obtener la lista de libros para el usuario
        console.error('Error getting the books list for user', error)
        res.status(500).json({ error: 'Error getting the books list for user' })
      }
      
      res.status(200).json({ isAuthorized: true, userID: user.uid , idToken: await auth.currentUser.getIdToken() , name: fullName})
  
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
    res.status(200).json({message: "Correo enviado exitosamete"})
  } catch (error) {
    // No se pudo enviar el correo de restablecimiento de contraseña
    console.error('Error al enviar el correo de restablecimiento de contraseña:', error)
    // Manejar errores y enviar una respuesta de error
    res.status(500).json({ error: error.message })
  }
})

// Ruta para borrado de un libro
app.delete('/api/delete/book/:bookId' , isAuthenticated, async (req, res) => {
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
    const newBookRef = await addDoc(collection(db,'books'), bookData)
    res.status(201).json({ message: 'Libro creado exitosamente', bookId: newBookRef.id })
  } catch (error) {
    // No se pudo crear el libro
    console.error('Error al crear el libro:', error)
    res.status(500).json({ error: 'Hubo un error al crear el libro',errorFire:error })
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

app.post('/api/payment/confirm', isAuthenticated,  async (req, res) => {
  const { orderID, bookId, userId } = req.body;

  try {
      const PAYPAL_API = 'https://api-m.sandbox.paypal.com'; // Replace with live API in production
      
      const CLIENT_ID = process.env.PAYPAL_CLIENT_ID;
      const SECRET = process.env.PAYPAL_SECRET;
      const auth = Buffer.from(`${CLIENT_ID}:${SECRET}`).toString('base64');

      const tokenResponse = await fetch(`${PAYPAL_API}/v1/oauth2/token`, {
          method: 'POST',
          headers: {
              Authorization: `Basic ${auth}`,
              'Content-Type': 'application/x-www-form-urlencoded',
          },
          body: 'grant_type=client_credentials',
      });

      const tokenData = await tokenResponse.json();
      // Verify the order with PayPal
      const orderResponse = await fetch(`${PAYPAL_API}/v2/checkout/orders/${orderID}`, {
          headers: {
              Authorization: `Bearer ${tokenData.access_token}`,
          },
      });

      const orderData = await orderResponse.json();

      if (orderData.status === 'COMPLETED') {
        /// Preparar los datos de la orden para Firestore
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

      res.status(201).json({ success: true, message: 'Pago confirmado y orden guardada exitosamente', orderId: newOrderRef.id });
    } else {
      res.status(400).json({ error: 'Orden no completada' });
    }
  } catch (error) {
    console.error('Error al confirmar la orden con PayPal:', error);
    res.status(500).json({ error: 'Error interno del servidor', details: error.message });
  }
});

app.get('/api/read/orders/auth/:userID', isAuthenticated, async (req, res) => {
  try {
    const userID = req.params.userID; // Obtener el ID del usuario de los parámetros de la URL

    const ordersCol = collection(db, 'orders'); // Referencia a la colección 'orders'
    const querySnapshot = await getDocs(query(ordersCol, where('userId', '==', userID))); // Filtrar órdenes por 'userID'

    const ordersList = [];
    querySnapshot.forEach((doc) => {
      ordersList.push({
        id: doc.id, // Incluir el ID del documento
        ...doc.data(), // Agregar los datos del documento
      });
    });

    res.status(200).json(ordersList); // Responder con la lista de órdenes
  } catch (error) {
    console.error('Error obteniendo las órdenes para el usuario', error);
    res.status(500).json({ error: 'Error obteniendo las órdenes para el usuario' });
  }
});

// Configuración del servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor iniciado en el puerto ${PORT}`);
});
