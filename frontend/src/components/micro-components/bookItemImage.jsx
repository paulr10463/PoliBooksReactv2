import React, {useEffect, useState} from 'react';
import '../../styles/bookItem.css'
import UploadImage from './uploadImage.jsx'
import {transformImages } from '../../utils/urlUtils.jsx'

const bookItem = ({ defaultImages, title, description, handleCallback }) => {

    const imagesFormated = transformImages(defaultImages);
    const [images, setImages] = useState();
    
    const handleImageChanges = (images) => {
        setImages(images);
    };   

    useEffect(() => {
        handleCallback && handleCallback(images);
    }, [images]);


    return (
        <div className="book-item-container book-item-image-container">
            <div className="book-item-header">
                <h3>{title}</h3>
                <p>{description}</p>
            </div>
            <div className="book-item-body">
                <UploadImage defaultImages={imagesFormated} imagesCallback={handleImageChanges}/>
            </div>
        </div>
    );
};

bookItem.defaultProps = {
    title: "Title",
    description: "Description",
    handleCallback: null,
    images: []
}
export default bookItem;