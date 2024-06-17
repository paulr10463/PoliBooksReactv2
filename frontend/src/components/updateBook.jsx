import "../styles/createBook.css";
import BookItem from './micro-components/bookItem.jsx'
import BookItemImage from './micro-components/bookItemImage.jsx'
import { useEffect, useState } from "react";
import {updateBookinDB} from "../utils/book";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { errorToast, successToast, infoToast } from '../utils/toast.jsx';
import { useAuth } from '../utils/authContext.jsx';

export default function UpdateBook({book}) {
  const { authData } = useAuth();
  // Declaración de estados y variables
  const [isSaved, setIsSaved] = useState(false);
  const [checkboxChecked, setCheckbox] = useState(false);
  const [isFormValid, setIsFormValid] = useState(true);
  const [inputValidities, setInputValidities] = useState([
    true, true, true, true, true, true, true, true
  ]);
  const [images, setImages] = useState([]);

  function handleCheckboxChange() {
    setCheckbox(!checkboxChecked);
  }
/* Se recopilan los datos del formulario y se llama a la función updateBookinDB 
para actualizar el libro en la base de datos.
El resultado se almacena en el estado isSaved */
function onPublishButtonClick() {
      const userID = authData.userID;
      const tokenID = authData.idToken;
      const title = document.getElementById('update-book-title').value;
      const description = document.getElementById('update-book-description').value;
      const brand = document.getElementById('update-book-brand').value;
      const level = document.getElementById('update-book-level').value;
      const availability = parseInt(document.getElementById('update-book-availability').value);
      const institution = document.getElementById('update-book-institution').value;
      const price = parseFloat(document.getElementById('update-book-price').value);
      const contact = document.getElementById('update-book-contact').value;
      // Guardar el libro en la base de datos 
      const save = updateBookinDB(book.id, userID, tokenID, title, description, brand, level, availability, images, institution, price, contact);
      setIsSaved(save);
  }

  useEffect(() => {
    const formIsValid = inputValidities.reduce((acc, curr) => acc && curr, true);
    setIsFormValid(formIsValid && checkboxChecked);
  }, [inputValidities, checkboxChecked]);

  useEffect(() => {
    // Validamos que el checkbox esté seleccionado
    if (isFormValid) {
      document.getElementById("update-button").disabled = false;
    } else {
      document.getElementById("update-button").disabled = true;
    }
  }, [isFormValid]);

  useEffect(() => {
    if (isSaved) {
      successToast('El libro se actualizó correctamente.');
      setTimeout(()=>(window.location.href = '/seller'), 2000);
    } 
  }, [isSaved]);

  // Función para actualizar la validez de una instancia específica
  function updateInputValidity(index, isValid) {
    const newValidities = [...inputValidities];
    newValidities[index] = isValid;
    setInputValidities(newValidities);
  }
  
  const updateImagesURLs = (images) => {
    setImages(images); 
  };

  return (
    // Renderización del componente
    <div className="create-book">
      <ToastContainer />
      <h1>Editar un libro</h1>
      <div className="create-book-layout">
        <BookItem
          title="Titulo"
          description="Escriba el título tal y como aparece en la portada del libro."
          index={0}
          handleCallback={updateInputValidity}
          id="update-book-title"
          value={book.title}
        />
        <BookItemImage
          title="Imagen(es)"
          description="Seleccione imagenes para el libro (max 5)"
          handleCallback={updateImagesURLs}
          defaultImages={book.image}
        />
        <BookItem
          title="Descripción"
          description="Escriba una descripción sobre el libro."
          index={1}
          handleCallback={updateInputValidity}
          id="update-book-description"
          value={book.description}
        />
        <BookItem
          title="Marca"
          description="Escriba la marca del libro."
          index={2}
          handleCallback={updateInputValidity}
          id="update-book-brand"
          value={book.brand}
        />
        <BookItem
          title="Nivel"
          description="Escriba el nivel académico del libro."
          index={3}
          handleCallback={updateInputValidity}
          id="update-book-level"
          value={book.level}
        />
        <BookItem
          type="number"
          title="Disponibilidad"
          description="Escriba las unidades disponibles para vender."
          index={4}
          handleCallback={updateInputValidity}
          id="update-book-availability"
          value={book.availability}
        />
        <BookItem
          title="Institución"
          description="Escriba a que institución pertene el libro."
          index={5}
          handleCallback={updateInputValidity}
          id="update-book-institution"
          value={book.institution}
        />
        <BookItem
          type="float"
          title="Costo"
          description="Escriba el precio para el libro (decimales con ',')."
          index={6}
          handleCallback={updateInputValidity}
          id="update-book-price"
          value={book.price}
        />
        <BookItem
          type="phone"
          title="Contacto"
          description="Escriba un número de celular/teléfono."
          index={7}
          handleCallback={updateInputValidity}
          id="update-book-contact"
          value={book.contact}
        />

      </div>
      <label className="checkbox-container">
        <input type="checkbox" id="update-checkbox" onChange={handleCheckboxChange}></input>
        <span className="checkmark"></span>
        <span className="checkmark-text">Garantizo que la información publicada es verídica y Acepto los términos y condiciones de PoliBooks.</span>
      </label>
      <button id="update-button" className="publish-button" onClick={onPublishButtonClick}>Publicar</button>
    </div>
  );
};
