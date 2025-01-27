import React, { useState, useEffect } from "react";
import "../styles/registerUserBox.css";
import PasswordField from "./micro-components/passwordField";
import TextInput from "./micro-components/textInput";
import "react-toastify/dist/ReactToastify.css";
import { errorToast, successToast } from "../utils/toast.jsx";
import { fetchRegisterUser } from "../services/user.services.js";

const RegisterUserBox = () => {
    const [isFormValid, setIsFormValid] = useState(false);
    const [inputValidities, setInputValidities] = useState([false, false, false, false]);

    // Update the validity state of a specific input
    const updateInputValidity = (index, isValid) => {
        setInputValidities((prevValidities) => {
            const newValidities = [...prevValidities];
            newValidities[index] = isValid;
            return newValidities;
        });
    };

    // Check if the form is valid whenever inputValidities changes
    useEffect(() => {
        setIsFormValid(inputValidities.every((validity) => validity));
    }, [inputValidities]);

    // Handle focus and blur events for password field details
    useEffect(() => {
        const securityInput = document.getElementById('user-form-password');
        securityInput.addEventListener('focus', function () {
            const securityDetails = document.querySelector('.password-details');
            securityDetails.style.display = 'block';
        });
        securityInput.addEventListener('blur', function () {
            const securityDetails = document.querySelector('.password-details');
            securityDetails.style.display = 'none';
        });
        return () => {
            securityInput.removeEventListener('focus', function () {
                const securityDetails = document.querySelector('.password-details');
                securityDetails.style.display = 'block';
            });
            securityInput.removeEventListener('blur', function () {
                const securityDetails = document.querySelector('.password-details');
                securityDetails.style.display = 'none';
            });
        }
    }, []);

    const handleRegister = () => {
        if (!isFormValid) {
            errorToast("El formulario no es válido.");
            return;
        }

        const name = document.getElementById("user-form-name").value;
        const email = document.getElementById("user-form-email").value;
        const password = document.getElementById("user-form-password").value;
        const phone = document.getElementById("user-form-phone").value;

        fetchRegisterUser(name, email, password, phone)
            .then((response) => {
                if (response.status === 200) {
                    successToast("El usuario se registró correctamente.");
                    setTimeout(() => (window.location.href = "/"), 2000);
                } else {
                    console.log("Error response:", response);
                    errorToast(
                        "Ha ocurrido un error. Por favor, intenta nuevamente. " +
                        (response.error || "Error desconocido.")
                    );
                }
            })
            .catch((error) => {
                console.error("Fetch error:", error);
                errorToast("Error al registrar: " + error.message);
            });
    };

    return (
        <div className="r-border">
            <div className="col r-title">
                <b>Regístrate</b>
            </div>

            <div className="internalBorder">
                <form className="UserForm">
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
                            type="email"
                            index={1}
                        />
                    </div>
                    <div className="mb-3 password-section">
                        <div className="password-details">
                            La contraseña debe contar con:
                            <ul>
                                <li>Letras mayúsculas y minúsculas</li>
                                <li>Al menos un número</li>
                                <li>Mínimo 8 caracteres</li>
                            </ul>
                        </div>
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
                            type="phone"
                            index={3}
                        />
                    </div>
                    <button
                        type="button"
                        id="successReg"
                        onClick={handleRegister}
                        className="btn btn-success"
                    >
                        Registrarse
                    </button>
                </form>
            </div>
        </div>
    );
};

export default RegisterUserBox;
