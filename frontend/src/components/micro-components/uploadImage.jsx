import React, { useState, useRef, useEffect } from "react";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { errorToast, successToast, infoToast } from '../../utils/toast.jsx';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, A11y } from 'swiper/modules';
import 'swiper/swiper-bundle.css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import '../../styles/uploadImage.css'
import { postImage } from "../../services/images.service.js";

function UploadImage({ defaultImages, imagesCallback }) {
  // State para almacenar archivos seleccionados
  const [fileInfos, setFileInfos] = useState(defaultImages || []);
  const fileInputRef = useRef(null);

  useEffect(() => {
    const images = []
    fileInfos.map((fileInfo, index) => (
      images.push(fileInfo.url)
    ));
    console.log(images);
    imagesCallback && imagesCallback(images);
  }, [fileInfos]);

  const handleButtonClick = () => {
    // Abre el explorador de archivos al hacer clic en el botón
    fileInputRef.current.click();
  };

  const uploadFile = (file) => {
    const formData = new FormData();
    formData.append('file', file);
    postImage(formData)
      .then(response => {
        if (!response.ok) {
          return response.json(); // Manejar el error del servidor
        }
        return response.json();
      })
      .then(data => {
        if (data.error) {
          errorToast(data.error); // Mostrar el mensaje de error del servidor
        } else {
          successToast("La imagen se subió correctamente.");
          setFileInfos((prevFileInfos) => [...prevFileInfos,{url:data.url, name: file.name}]);
        }
      })
      .catch(error => {
        errorToast("No se pudo subir el archivo."); // Manejar errores de red u otros errores
      });

  };

  const handleChange = (event) => {
    // Almacenar los archivos seleccionados en el estado
    const selectedFiles = event.target.files;
    // Verifica que el número de archivos no exceda 5
    if (selectedFiles.length + fileInfos.length > 5) {
      errorToast("No puedes seleccionar más de 5 archivos.");
      return;
    }
    // Subir cada archivo
    for (const selectedFile of selectedFiles) {
      uploadFile(selectedFile);
    }
  };

  return (
    <div className="file-input-container">
      <Swiper
        className='upload-image-container'
        modules={[Navigation, Pagination, A11y]}
        spaceBetween={0}
        slidesPerView={1}
        navigation
        pagination={{ clickable: true }}
      >
        {fileInfos.map((fileInfo, index) => (
          <SwiperSlide key={index}>
            <img src={fileInfo.url} alt="imagen del libro" />
          </SwiperSlide>
        ))}
      </Swiper>
      <div className="button-list-container">
        <input
          ref={fileInputRef}
          className="file-input"
          type="file"
          onChange={handleChange}
          multiple
          accept="image/*"
        />
        <button className="file-input-button" onClick={handleButtonClick}>
          Seleccionar archivo
        </button>
        <ToastContainer />
        {fileInfos.length > 0 && (
          <div>
            Archivos seleccionados:
            <ul>
              {fileInfos.map((fileInfo, index) => (
                <li key={index}>
                  {fileInfo.name}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}

export default UploadImage;