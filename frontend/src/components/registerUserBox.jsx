import "../styles/registerUserBox.css";
import PasswordField from "./micro-components/passwordField";
import TextInput from "./micro-components/textInput";
import { useState, useEffect } from "react";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { errorToast, successToast } from '../utils/toast.jsx';

const RegisterUserBox = () => {
    const [isFormValid, setIsFormValid] = useState(false);
    const [inputValidities, setInputValidities] = useState([false, false, false, false]);

    // Función para actualizar la validez de una instancia específica
    function updateInputValidity(index, isValid) {
        const newValidities = [...inputValidities];
        newValidities[index] = isValid;
        setInputValidities(newValidities);
    };

    useEffect(() => {
        const formIsValid = inputValidities.reduce((acc, curr) => acc && curr, true);
        setIsFormValid(formIsValid);
      }, [inputValidities]);


    function handleRegister() {
        if (!isFormValid) {
            errorToast('El formulario no es válido.')
        }else{
            const name = document.getElementById('user-form-name').value;
            const email = document.getElementById('user-form-email').value;
            const password = document.getElementById('user-form-password').value;
            const phone = document.getElementById('user-form-phone').value;
            fetch('https://polibooksapi.azurewebsites.net/api/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({name, email, password, phone}),
            }).then((response) => {
                if (response.status === 200) {
                    successToast('El usuario se registró correctamente.');
                    setTimeout(()=>(window.location.href = '/'), 2000);
                } else {
                    errorToast('Ha ocurrido un error. Por favor, intenta nuevamente.');
                }
            });
        }
    }
    
    return (
        <div className=" r-border">
            <ToastContainer />
            <div className="col r-title">
                <b>Registrate</b>
            </div>

            <div className="internalBorder">
                <form action="" className="UserForm">
                    <div className="mb-3">
                        <TextInput 
                            placeholder="Nombres y Apellidos"
                            id="user-form-name" 
                            isValidCallback={updateInputValidity}
                            index={0}
                        />
                    </div>
                    <div className="mb-3">
                        <TextInput 
                            placeholder="Correo Electrónico" 
                            id="user-form-email" 
                            isValidCallback={updateInputValidity}
                            type={"email"}
                            index={1}
                        />
                    </div>
                    <div className="mb-3">
                        <PasswordField 
                            placeholder="Contraseña"
                            id="user-form-password" 
                            isValidCallback={updateInputValidity}
                            index={2}
                        />   
                    </div>
                    <div className="mb-3">
                        <TextInput 
                            placeholder="Número de Teléfono" 
                            id="user-form-phone" 
                            isValidCallback={updateInputValidity}
                            type={"phone"}
                            index={3}
                        />
                    </div>
                    <button type="button" id="successReg" onClick={handleRegister} className="btn btn-success">Registrarse</button>
                </form>
            </div >
        </div >
    )
}

export default RegisterUserBox