import { useEffect, useState } from "react";
import "../styles/header.css";
import LoginModal from "./loginModal";
import { useAuth } from "../utils/authContext";
import { infoToast, errorToast } from "../utils/toast";
import { logout } from "../services/auth.service";

const Header = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [buttonValue, setButtonValue] = useState("Iniciar sesión");
  const { authData, setAuthorization } = useAuth();

  useEffect(() => {
    if (!authData) {
      setButtonValue("Iniciar sesión");
      return;
    }
    authData.isAuthorized
      ? setButtonValue("Cerrar sesión")
      : setButtonValue("Iniciar sesión");
  }, [authData]);

  const openModal = async () => {
    if (!authData || !authData.isAuthorized) {
      setIsModalOpen(true);
      return;
    }

    try {
      // Call the logout service
      await logout(authData.idToken, authData.userID);

      // Clear user authentication data
      setAuthorization({ isAuthorized: false, idToken: null, userID: null });
      setButtonValue("Iniciar sesión");
      infoToast("Cierre de sesión exitoso");
    } catch (error) {
      console.error("Error during logout:", error);
      errorToast("Error al cerrar sesión. Inténtalo de nuevo.");
    }
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
        <a href="/" className="logo">
          <svg
            width="30"
            height="35"
            viewBox="0 0 22 28"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            {/* SVG content */}
          </svg>
        </a>
        <div className="button-container">
          <input
            onClick={openModal}
            className="btn-buy"
            type="button"
            value={buttonValue}
          ></input>
          {authData && authData.isAuthorized && (
            <input
              onClick={handleMyBooks}
              className="btn-buy"
              type="button"
              value="Mis libros"
            ></input>
          )}
          {!authData.isAuthorized && (
            <input
              onClick={handleRedirect}
              className="btn-buy"
              type="button"
              value="Registrarse"
            ></input>
          )}
        </div>
      </div>

      <LoginModal
        isOpen={isModalOpen}
        onRequestClose={() => setIsModalOpen(false)}
      />
    </>
  );
};

export default Header;
