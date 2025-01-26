import React, { useState, useRef, useEffect } from "react";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { errorToast } from "../../utils/toast.jsx";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, A11y } from "swiper/modules";
import "swiper/swiper-bundle.css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "../../styles/uploadImage.css";


function UploadImage({ onBookUploaded }) {
  const [fileInfos, setFileInfos] = useState([]);
  const fileInputRef = useRef(null);

  useEffect(() => {
    const images = fileInfos.map((fileInfo) => fileInfo.file);
    onBookUploaded && onBookUploaded(images);
  }, [fileInfos]);

  const handleButtonClick = () => {
    fileInputRef.current.click();
  };

  const verifyFileType = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        const arrayBuffer = reader.result;
        const bytes = new Uint8Array(arrayBuffer).subarray(0, 4);
        const header = bytes.reduce((acc, byte) => acc + byte.toString(16), "");

        // Verificar los encabezados de las imágenes conocidas
        const validHeaders = {
          jpeg: "ffd8ffe0", // JPEG
          png: "89504e47", // PNG
          gif: "47494638", // GIF
        };

        if (
          header.startsWith(validHeaders.jpeg) ||
          header.startsWith(validHeaders.png) ||
          header.startsWith(validHeaders.gif)
        ) {
          resolve(true);
        } else {
          reject(new Error("Archivo no válido"));
        }
      };

      reader.onerror = () => reject(new Error("No se pudo leer el archivo"));
      reader.readAsArrayBuffer(file);
    });
  };

  const handleChange = (event) => {
    const selectedFiles = event.target.files;

    if (selectedFiles.length + fileInfos.length > 5) {
      errorToast("No puedes seleccionar más de 5 imágenes.");
      return;
    }

    Array.from(selectedFiles).forEach((file) => {
      verifyFileType(file)
        .then(() => {
          const newFileInfo = {
            file,
            name: file.name,
            url: URL.createObjectURL(file),
          };
          setFileInfos((prev) => [...prev, newFileInfo]);
        })
        .catch(() => {
          errorToast(`"${file.name}" no es una imagen válida.`);
        });
    });
  };

  return (
    <div className="file-input-container">
      <Swiper
        className="upload-image-container"
        modules={[Navigation, Pagination, A11y]}
        spaceBetween={0}
        slidesPerView={1}
        navigation
        pagination={{ clickable: true }}
      >
        {fileInfos.map((fileInfo, index) => (
          <SwiperSlide key={index}>
            <img src={fileInfo.url} alt={`Preview ${fileInfo.name}`} />
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
          Seleccionar archivos
        </button>
        <ToastContainer />
      </div>
    </div>
  );
}

export default UploadImage;
