import React, { useState } from 'react';
import Modal from 'react-modal';
import '../styles/modals.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faX } from '@fortawesome/free-solid-svg-icons'
import PasswordField from './micro-components/passwordField';

const ResetPasswordModal = () => {
  const [modalIsOpen, setModalIsOpen] = useState(false);

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

  const openModal = () => {
    setModalIsOpen(true);
  }

  const closeModal = () => {
    setModalIsOpen(false);
  }

  return (
    <div>
      <button onClick={openModal}>Abrir Modal</button>

      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        style={customStyles}
        contentLabel="Ejemplo Modal"
      >
        <section>
          <div className="modal-content">
            <a onClick={closeModal} className="modal-close-icon"><FontAwesomeIcon icon={faX} /></a>
            <h2>Establecer la contraseña</h2>
            <p className="modal-text-description">Ingresa una contraseña con las siguientes características:</p>
            <ul>
              <li class="reset-dialog-text"><p className="modal-text-list">Debe incluir letras y números. </p></li>
              <li class="reset-dialog-text"><p className="modal-text-list">Debe combinar letras mayúsculas y minúsculas.</p></li>
              <li class="reset-dialog-text"><p className="modal-text-list">La longitud de la contraseña debe ser igual o mayor a 8 caracteres.</p></li>
            </ul>
            <form>
              <div className='passwords-container'>
                <PasswordField placeholder="Nueva contraseña"/>
                <PasswordField placeholder="Vuelva a escribir la contraseña"/>
              </div>
              <button className="reset-password-button" type="button">Confirmar</button>
              </form>
          </div>

        </section>


      </Modal>
    </div>
  );
}

export default ResetPasswordModal;
