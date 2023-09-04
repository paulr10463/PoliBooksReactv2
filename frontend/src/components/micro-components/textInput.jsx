import React from 'react';
import { useState, useEffect } from 'react';
import '../../styles/textInput.css'

const TextInput = ({ id, type, isValidCallback, placeholder, index}) => {
  const [isValid, setIsValid] = useState(false);
  const [value, setValue] = useState("");

  let regex = /.*/;
  let valueToReplace;
  let maxLength = 100;
  let fieldClass = "text";

  switch (type) {
    case "phone":
        regex = /^[0][9][0-9]{8}$/;
        valueToReplace = /[^0-9]/g;
        maxLength = 10;
        break;
    case "email":
        regex = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;
        maxLength = 255; // Longitud máxima recomendada para direcciones de correo electrónico
        break;
    case "password":
        regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/
        fieldClass = "password";
        break;
  }

  function handleInputChange(event) {
    const inputValue = event.target.value;
    const newValue = inputValue.substring(0, maxLength); // Limitar la longitud del valor
    const isValidValue = regex.test(newValue);
    setValue(newValue);
    setIsValid(isValidValue);
  }

  useEffect(() => {
    // Validamos que el valor introducido solo contenga números
    isValidCallback && isValidCallback(index, isValid);
  }, [isValid]);

    return (
        <div className='inputBox'>
            <input
                required="required"
                id={id}
                type={fieldClass}
                onChange={handleInputChange}
                value={value} // Establecer el valor controlado
                className={isValid ? "is-valid" : "is-invalid"}
            >
            </input>
            <span>{placeholder}</span>
        </div>
    );
};

TextInput.defaultProps = {
  value: "",
  onChange: () => { },
  type: "text",
  fieldClass: "text",
  placeholder: "Placeholder"
};

export default TextInput;