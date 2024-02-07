import { useEffect, useState } from "react";
import "../styles/header.css"
import LoginModal from "./loginModal";
import { useAuth } from '../utils/authContext';
import { infoToast } from "../utils/toast";


const Header = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [buttonValue, setButtonValue] = useState("Iniciar sesión");
  const { authData, setAuthorization } = useAuth();

  useEffect(() => {
    console.log(authData);
    if (!authData) { setButtonValue("Iniciar sesión"); return; }
    authData.isAuthorized ? setButtonValue("Cerrar sesión") : setButtonValue("Iniciar sesión");
    console.log(authData.isAuthorized);
  }, [authData]);

  const openModal = () => {
    if (!authData || !authData.isAuthorized) { setIsModalOpen(true); return; }
    setAuthorization({ isAuthorized: false, idToken: null, userID: null });
    setButtonValue("Iniciar sesión");
    infoToast("Cierre de sesión exitoso");
  };

  const handleRedirect = () => {
    window.location.href = "/register";
  };

  const handleMyBooks = () => {
    window.location.href = "/seller";
  };

  return (
    <>
      <div id="header">
        <a href="/" className="logo"><img src="https://firebasestorage.googleapis.com/v0/b/polibooksweb.appspot.com/o/Logo.jpg?alt=media&token=c1447e9a-5903-4b71-afef-3e9a23e0039c" alt=""></img></a>
        <div className="quote">
          “La lectura de un buen libro es un diálogo incesante, en que el libro habla, y el alma contesta” (André Maurois).
        </div>
        <div className="button-container">
          <input onClick={openModal} className="btn-buy bg-red-500" type="button" value={buttonValue}></input>
          {
            authData && authData.isAuthorized && <input onClick={handleMyBooks} className="btn-buy" type="button" value="Mis libros"></input>
          }
          {
            !authData.isAuthorized && <input onClick={handleRedirect} className="btn-buy" type="button" value="Registrarse"></input>
          }
        </div>
      </div>

      <LoginModal isOpen={isModalOpen} onRequestClose={() => setIsModalOpen(false)} />

    </>
  )
};
//
export default Header;

