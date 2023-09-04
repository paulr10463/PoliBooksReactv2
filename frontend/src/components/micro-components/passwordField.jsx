import React, { useState, useEffect } from 'react';
import { faEye , faEyeSlash } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import '../../styles/passwordField.css'
import TextInput from './textInput';

const PasswordField = ({id, isValidCallback, placeholder, index}) => {

    const [isVisible, setVisibility] = useState("password");
    const [isInputValid, setIsInputValid] = useState(false);
    const icon = isVisible === "password" ? faEye : faEyeSlash;

    function handleClick() {
        if (isVisible === "password") {
            setVisibility("text");
        }else{
            setVisibility("password");
        }
    }

    const handleInputValidity = (index, isValid) => {
        setIsInputValid(isValid) 
    };  

    useEffect(() => {
        isValidCallback && isValidCallback(index, isInputValid);
    }, [isInputValid]);

    return (
        <div className="password-container">
            <TextInput 
                type={isVisible} 
                placeholder={placeholder}
                id={id} 
                isValidCallback={handleInputValidity}
                index={index}
                />
            <a onClick={handleClick} ><FontAwesomeIcon className="fa-eye" icon={icon} /></a>
        </div>
    );
};

export default PasswordField;