import React, { useState} from 'react';
import '../../styles/bookItem.css'
import InputElement from './inputElement';


const bookItem = ({ value, id, type, title, description, handleCallback, index }) => {
    // Define un estado para el valor del input
    const [inputValue, setInputValue] = useState(value);
    const [isInputValid, setIsInputValid] = useState(false);

    // Manejador de cambio para el input
    const handleInputChange = (event) => {
        setInputValue(event.target.value);
    };  

    const handleInputValidity = (isValid) => {
        setIsInputValid(isValid) 
        handleCallback && handleCallback(index, isValid);
    };    

    return (
        <div className="book-item-container">
            <div className="book-item-header">
                <h3>{title}</h3>
                <p>{description}</p>
            </div>
            <InputElement 
                id={id}
                type={type}
                value={inputValue}
                onChange={handleInputChange}
                isValidCallback={handleInputValidity}
            />
            {isInputValid ? (
                <p className="valid-message"></p>

            ) : (
                <p className="invalid-message"></p>
            )}
        </div>

      
    );
};

bookItem.defaultProps = {
    type: "text",
    title: "Title",
    description: "Description",
    handleCallback: null,
    index: 0,
    value: ""
}

export default bookItem;