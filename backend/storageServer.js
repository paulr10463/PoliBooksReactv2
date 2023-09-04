// Cambiar de esto
const express = require('express');
const cors = require('cors');
const multer = require('multer');
const { getStorage, ref, uploadBytesResumable, getDownloadURL } = require("firebase/storage");
require('dotenv').config();
const { initializeApp } = require("firebase/app");
const firebaseConfig = require('./firebaseConfig');

const appFirebase = initializeApp(firebaseConfig);
const firebaseStorage = getStorage(appFirebase);

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });
const app = express();

app.use(express.json());
app.use(cors());


app.post('/upload', upload.single('file'), async (req, res) => {
  try {
    const file = req.file;
    if (!file) {
      return res.status(400).send('No se ha proporcionado un archivo.');
    }
    console.log("fileeeeeeeeeeeeeeeee:", file);

    const storageRef = ref(firebaseStorage, `/files/${file.originalname}`);
    const uploadTask = await uploadBytesResumable( storageRef, file.buffer );
    const downloadURL = await getDownloadURL(uploadTask.ref);
    console.log("downloadURL:", downloadURL);
    return res.status(200).send({url: downloadURL});
  } catch (error) {
    console.error(error);
    res.status(500).send('Error al subir el archivo.');
  }
});


const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Servidor de Storage en el puerto ${PORT}`);
});