import React, { useEffect } from 'react';
import '../../styles/sellerProfileBook.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPenToSquare, faTrash } from '@fortawesome/free-solid-svg-icons'
import Swal from 'sweetalert2';
import { useAuth } from '../../utils/authContext.jsx';
import { deleteBooks } from '../../services/book.service.js';
import { useState } from 'react';
import { twoOptionShowBox , loading } from '../../services/notifications.service.js';

const SellerBookItem = ({ book }) => {
    const { authData } = useAuth();
    const [isLoading, setIsLoading ] = useState(false);
    const urlImage = "https://firebasestorage.googleapis.com/v0/b/polibooksweb.appspot.com/o/polibooks%2FnotAvailableBook.png?alt=media&token=0b68b219-5e8a-4652-92d5-7b1ddcd2d129"
    function handleEdit() {
        window.location.href = `/update/${book.id}`;
    }

    useEffect( () => {
        if(isLoading){
            Swal.showLoading();
        }
    },[isLoading])
    
    function handleDelete() {       
        twoOptionShowBox()
        .then((result) => {
            if (result.isConfirmed) {
                setIsLoading(true);
                deleteBooks(book.id, 13123)
                    .then(() => {
                        Swal.fire('¡Hecho!', 'La acción se ha completado.', 'success');
                    })
                    .catch((error) => {
                        console.error("Error in Seller Profile:", error);
                        Swal.fire('Error', error.error || 'Unknown error', 'error');
                    })
                    .finally(() => setIsLoading(false));
            }
        });
        
      }
      return (
         
        <div data-aos="fade-up" id="book_for_sale_{id}" className="portfolio-item">
            <div className="portfolio-wrap">
                <button className="btn-edit" data-book-id="1" onClick={handleEdit}><FontAwesomeIcon icon={faPenToSquare} /></button>
                <button className="btn-delete" data-book-id="1" onClick={handleDelete}><FontAwesomeIcon icon={faTrash} /></button>  
                <img src={book.image.length > 0? book.image: urlImage} className="img-fluid" alt="Portada del libro"></img>
                <div className="portfolio-info">
                    <h4>{book.title}</h4>
                    <p>{book.level}</p>
                </div>
            </div>
        </div>
    );
};

SellerBookItem.defaultProps = {
    imgURL: "https://m.media-amazon.com/images/I/81LcMpsU7xL._AC_UF350,350_QL50_.jpg", 
    level: "Nivel",
    title: "Title",
}

export default SellerBookItem;