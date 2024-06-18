
import Modal from 'react-modal';
import '../styles/modals.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faX } from '@fortawesome/free-solid-svg-icons'
import {  useState } from 'react';
import Forgot from './forgotPasswordModal';
import PasswordField from './micro-components/passwordField';
import TextInput from './micro-components/textInput';
import { useAuth } from '../utils/authContext';
import { signIn } from '../utils/user';
import { ToastContainer } from 'react-toastify';
import { successToast, errorToast } from '../utils/toast';
import 'react-toastify/dist/ReactToastify.css';


const LoginModal =  ({isOpen, onRequestClose }) => {
  const { isAuthorized, setAuthorization } = useAuth();
  const [ isFPModalOpen, setIsFPModalOpen ] = useState(false);

  const openModal = () => {
    onRequestClose();
    setIsFPModalOpen(true);
  };

  const handleLogin = () => {
    const email = document.getElementById('modal-email-login').value;
    const password = document.getElementById('modal-password-login').value;
    console.log(email, password);
    signIn({email, password}).then((data) => {
      console.log("data: " + data);
      if(data.isAuthorized){
        successToast("Inicio de sesión exitoso");
        setAuthorization(data);
        onRequestClose();
      }else{
        errorToast('Correo o contraseña incorrectos');
      }  
    }).catch((error) => {
      console.log(error); //----------
      errorToast('Error al iniciar sesión');
    });
  };

  const customStyles = {
    overlay: {
      zIndex: 1000, // Ajusta este valor según sea necesario
    },
    content: {
      top: '50%',
      left: '50%',
      right: 'auto',
      bottom: 'auto',
      transform: 'translate(-50%, -50%)',
    },
  };

  return (
    <div>
      
      <Modal
        isOpen={isOpen}
        onRequestClose={onRequestClose}
        style={customStyles}
        contentLabel="Ejemplo Modal"
      >
        <section>
          <div className="modal-content">
            <a onClick={onRequestClose} className="modal-close-icon"><FontAwesomeIcon icon={faX} /></a>
            <h2>Iniciar sesión</h2>
            <p className="modal-text-description">Inicia sesión para publicar tu Libro a la venta</p>
            <form>  
              <div className="inputs-container">
              <TextInput type="email" id="modal-email-login" placeholder="Usuario o correo electrónico"/>
              <PasswordField id="modal-password-login" placeholder="Contraseña"/>
              </div> 
              <a onClick={openModal} className="modal-link">¿Olvidaste tu contraseña?</a>
              <button onClick={handleLogin} className="modal-button" type="button">Iniciar sesión</button>
              <p className="modal-footer-text">¿No tienes cuenta? <a href="/register"> <b>Registrate</b></a></p>
            </form>
          </div>
        </section>
      </Modal>
      <Forgot isOpen={isFPModalOpen} onRequestClose={() => setIsFPModalOpen(false)} />
      <ToastContainer />
    </div>
  );
}

export default LoginModal;
