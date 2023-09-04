import "../../styles/bookForSale.css";
import "bootstrap/dist/css/bootstrap.min.css";
import Stars from './stars.jsx'
import { useState } from "react";

export default function Book ( {book} ) {
  const urlImage = "https://firebasestorage.googleapis.com/v0/b/polibooksweb.appspot.com/o/polibooks%2FnotAvailableBook.png?alt=media&token=0b68b219-5e8a-4652-92d5-7b1ddcd2d129"
  const handleClick = () => {
     window.location.href = "/detail/"+book.id;
    }
  
  return (
    <div className="icon-box" data-aos="fade-up" data-aos-delay="100">
      <img src= {book.image.length > 0? book.image : urlImage} className="books-item-image" alt=""></img>
      <div className="books-description">
        <h4 className="title">{book.title}</h4>
        <p> {book.description} </p>
        <div className="star-container">
          <Stars rating={3}/>
        </div>
        <h3>$ {book.price}</h3>
        <input className="buy-books-button" onClick={handleClick} type="button" value="Ver más"></input>
      </div>
    </div>
  );
};
