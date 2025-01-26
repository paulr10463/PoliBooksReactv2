import "../styles/createBook.css";
import BookItem from './micro-components/bookItem.jsx'
import BookItemImage from './micro-components/bookItemImage.jsx'
import { useEffect, useState } from "react";
import { saveBook } from "../utils/book";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { errorToast, successToast, infoToast } from '../utils/toast.jsx';
import { useAuth } from '../utils/authContext.jsx';
import { postImage } from "../services/images.service.js";

export default function CreateBook() {
  const { authData } = useAuth();
  const [isSaved, setIsSaved] = useState(false);
  const [checkboxChecked, setCheckbox] = useState(false);
  const [isFormValid, setIsFormValid] = useState(false);
  const [inputValidities, setInputValidities] = useState([
    false, false, false, false, false, false, false, false
  ]);
  const [images, setImages] = useState([]);
  const [imageUrls, setImageUrls] = useState([]);

  function handleCheckboxChange() {
    setCheckbox(!checkboxChecked);
  };

  const onPublishButtonClick = async () => {
    try {
      // Step 1: Validate and upload images
      let uploadedImageUrls = [];
      if (images && images.length > 0) {
        const formData = new FormData();
        images.forEach((image) => {
          formData.append('files', image);
        });
  
        try {
          const response = await postImage(formData, authData.idToken);
          uploadedImageUrls = response.uploadedFiles.map((file) => file.url);
          setImageUrls((prev) => [...prev, ...uploadedImageUrls]);
        } catch (error) {
          errorToast('Error al subir las imágenes');
          console.error('Image upload error:', error);
          return;
        }
      } else {
        errorToast('Debe seleccionar al menos una imagen');
        return;
      }

      const userID = authData.userID;
      const tokenID = authData.idToken;
      const title = document.getElementById('create-book-title').value;
      const description = document.getElementById('create-book-description').value;
      const brand = document.getElementById('create-book-brand').value;
      const level = document.getElementById('create-book-level').value;
      const availability = parseInt(document.getElementById('create-book-availability').value, 10);
      const institution = document.getElementById('create-book-institution').value;
      const price = parseFloat(document.getElementById('create-book-price').value);
      const contact = document.getElementById('create-book-contact').value;
  
      const bookPayload = {
        userID,
        title,
        description,
        brand,
        level,
        availability,
        image: uploadedImageUrls, // Include uploaded image URLs
        institution,
        price,
        contact,
      };
      try {
        await saveBook(bookPayload, tokenID); // Save the book
        successToast('Libro guardado exitosamente');

      } catch (error) {
        // Improved error message
        errorToast(`Error al guardar el libro: ${error.message}`);
        console.error('Book save error:', error);
      }
    } catch (error) {
      errorToast('Ha ocurrido un error inesperado');
      console.error('Unexpected error:', error);
    }
  };
  

  useEffect(() => {
    const formIsValid = inputValidities.reduce((acc, curr) => acc && curr, true);
    setIsFormValid(formIsValid && checkboxChecked);
  }, [inputValidities, checkboxChecked]);

  useEffect(() => {
    // Validamos que el checkbox esté seleccionado
    if (isFormValid) {
      document.getElementById("publish-button").disabled = false;
    } else {
      document.getElementById("publish-button").disabled = true;
    }
  }, [isFormValid]);

  useEffect(() => {
    if (isSaved) {
      successToast('El libro se publicó correctamente.');
      setTimeout(()=>(window.location.href = '/seller'), 2000);
    } 
  }, [isSaved]);

  // Función para actualizar la validez de una instancia específica
  function updateInputValidity(index, isValid) {
    const newValidities = [...inputValidities];
    newValidities[index] = isValid;
    setInputValidities(newValidities);
  };

  const updateImagesURLs = (images) => {
    setImages(images); 
  };

  return (
    <div className="create-book">
      <h1>Publicar un libro</h1>
      <div className="create-book-layout">
        <BookItem
          title="Titulo"
          description="Escriba el título tal y como aparece en la portada del libro."
          index={0}
          handleCallback={updateInputValidity}
          id="create-book-title"
        />
        <BookItemImage
          title="Imagen(es)"
          description="Seleccione imagenes para el libro (max 5)"
          handleCallback={updateImagesURLs}
        />
        <BookItem
          title="Descripción"
          description="Escriba una descripción sobre el libro."
          index={1}
          handleCallback={updateInputValidity}
          id="create-book-description"
        />
        <BookItem
          title="Marca"
          description="Escriba la marca del libro."
          index={2}
          handleCallback={updateInputValidity}
          id="create-book-brand"
        />
        <BookItem
          title="Nivel"
          description="Escriba el nivel académico del libro."
          index={3}
          handleCallback={updateInputValidity}
          id="create-book-level"
        />
        <BookItem
          type="number"
          title="Disponibilidad"
          description="Escriba las unidades disponibles para vender."
          index={4}
          handleCallback={updateInputValidity}
          id="create-book-availability"
        />
        <BookItem
          title="Institución"
          description="Escriba a que institución pertene el libro."
          index={5}
          handleCallback={updateInputValidity}
          id="create-book-institution"
        />
        <BookItem
          type="float"
          title="Costo"
          description="Escriba el precio para el libro (decimales con ',')."
          index={6}
          handleCallback={updateInputValidity}
          id="create-book-price"
        />
        <BookItem
          type="phone"
          title="Contacto"
          description="Escriba un número de celular/teléfono."
          index={7}
          handleCallback={updateInputValidity}
          id="create-book-contact"
        />
      </div>
      <label className="checkbox-container">
        <input type="checkbox" id="accept-checkbox" onChange={handleCheckboxChange}></input>
        <span className="checkmark"></span>
        <span className="checkmark-text">Garantizo que la información publicada es verídica y Acepto los términos y condiciones de PoliBooks.</span>
      </label>
      <button id="publish-button" className="publish-button" onClick={onPublishButtonClick}>Publicar</button>
    </div>
  );
};
