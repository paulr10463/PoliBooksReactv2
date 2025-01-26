import React, { useState, useEffect } from "react";
import "../../styles/textInput.css";

const TextInput = ({ id, type, isValidCallback, placeholder, index }) => {
    const [isValid, setIsValid] = useState(false);
    const [value, setValue] = useState("");

    let regex = /.*/;
    let valueToReplace;
    let maxLength = 100;

    switch (type) {
        case "phone":
            regex = /^[0][9][0-9]{8}$/;
            valueToReplace = /[^0-9]/g;
            maxLength = 10;
            break;
        case "email":
            regex = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;
            maxLength = 255;
            break;
        case "password":
            regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
            break;
        default:
            break;
    }

    const handleInputChange = (event) => {
        const inputValue = event.target.value.replace(valueToReplace || "", "");
        const newValue = inputValue.substring(0, maxLength);
        const isValidValue = regex.test(newValue);
        setValue(newValue);
        setIsValid(isValidValue);
    };

    useEffect(() => {
        isValidCallback && isValidCallback(index, isValid);
    }, [isValid, index, isValidCallback]);

    return (
        <div className="inputBox">
            <input
                required
                id={id}
                type="text"
                onChange={handleInputChange}
                value={value}
                className={isValid ? "is-valid" : "is-invalid"}
            />
            <span>{placeholder}</span>
        </div>
    );
};

TextInput.defaultProps = {
    value: "",
    type: "text",
    placeholder: "Placeholder",
};

export default TextInput;
