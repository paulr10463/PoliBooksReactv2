import React, { useState, useEffect } from "react";
import "../../styles/inputElement.css";

const InputElement = ({ id, value, onChange, type, isValidCallback }) => {
  const [isValid, setIsValid] = useState(false);
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
    case "float":
      regex = /^[0-9]+(?:,[0-9]{1,2})?$/;
      valueToReplace = /[^0-9,]|,{2,}|,\d{3,}/g;
      maxLength = 6;
      break;
    case "number":
      maxLength = 3
      fieldClass="number"
  }

  function checkField(inputValue){
    if (!regex.test(inputValue) || value.length === 0) {
      setIsValid(false);
    } else {
      setIsValid(true);
    }
  }
  useEffect(() => {
    checkField(value);
  }, [value]);

  useEffect(() => {
    // Validamos que el valor introducido solo contenga números
    isValidCallback && isValidCallback(isValid);
  }, [isValid]);

  return (
    <input
      id={id}
      value={value}
      type={fieldClass}
      min= {1}
      onChange={(event) => {
        if (event.target.value.length > maxLength) return;
        const newValue = event.target.value.replace(valueToReplace, '');
        // Actualizamos el valor y llamamos a la función onChange
        onChange({ target: { value: newValue } });
        checkField( newValue );
      }}
      className={isValid ? "input-element is-valid" : "input-element is-invalid"}
    >
    </input>
  );
};

InputElement.defaultProps = {
  value: "",
  onChange: () => { },
  type: "text",
  fieldClass: "text"
};

export default InputElement;