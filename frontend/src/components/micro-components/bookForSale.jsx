import "../../styles/bookForSale.css";
import "bootstrap/dist/css/bootstrap.min.css";
import Stars from './stars.jsx'
import { useState } from "react";

export default function Book ( {book} ) {
  const urlImage = "https://firebasestorage.googleapis.com/v0/b/polibooksweb.appspot.com/o/polibooks%2FnotAvailableBook.png?alt=media&token=0b68b219-5e8a-4652-92d5-7b1ddcd2d129"
  const handleClick = () => {
     window.location.href = "/detail/"+book.id;
    }
    
    const priceFormated = book.price?.toFixed(2);
    const priceIntegerPart = priceFormated?.split(".")[0];
    const priceDecimalPart = priceFormated?.split(".")[1];
    

    return (
    <div onClick={handleClick} className="icon-box" data-aos="fade-up" data-aos-delay="100">
      <img src= {book.image.length > 0? book.image : urlImage} className="books-item-image" alt=""></img>
      <div className="books-description">
        <h4 className="title">{book.title}</h4>
        <h3><span>US$</span> {priceIntegerPart} <span> {priceDecimalPart} </span></h3>
        <p> {book.description.length>50?book.description.substring(0,50)+"...":book.description} </p>
        <div className="star-container">
          <Stars rating={3}/>
        </div>
        
      </div>
    </div>
  );
};
