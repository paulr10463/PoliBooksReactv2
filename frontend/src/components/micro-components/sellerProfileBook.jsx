import React from 'react';
import '../../styles/sellerProfileBook.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPenToSquare, faTrash } from '@fortawesome/free-solid-svg-icons'
import Swal from 'sweetalert2';
import { useAuth } from '../../utils/authContext.jsx';

const SellerBookItem = ({ book }) => {
    const { authData } = useAuth();

    function handleEdit() {
        window.location.href = `/update/${book.id}`;
    }

    function handleDelete() {
        Swal.fire({
          title: '¿Estás seguro?',
          text: 'Esta acción no se puede deshacer',
          icon: 'warning',
          showCancelButton: true,
          confirmButtonColor: '#3085d6',
          cancelButtonColor: '#d33',
          confirmButtonText: 'Sí, ¡hazlo!',
          cancelButtonText: 'Cancelar',
        }).then((result) => {
          if (result.isConfirmed) {
            // Aquí puedes realizar la acción deseada cuando el usuario confirme
            
            fetch(`http://localhost:3000/api/delete/book/${book.id}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `${authData.idToken}`
                },
            }).then(response =>{
                if (response.status === 200) {
                    Swal.fire('¡Hecho!', 'La acción se ha completado.', 'success');
                    window.location.reload();
                }
                if (response.status === 401) {
                    Swal.fire('Error', 'No tienes permiso para realizar esta acción', 'error');
                }
                if (response.status === 400) {
                    Swal.fire('Error', 'No se emcpmtro el libro', 'error');
                }
            });
            }

          });
      }

    return (
        <div data-aos="fade-up" id="book_for_sale_{id}" className="portfolio-item">
            <div className="portfolio-wrap">
                <button className="btn-edit" data-book-id="1" onClick={handleEdit}><FontAwesomeIcon icon={faPenToSquare} /></button>
                <button className="btn-delete" data-book-id="1" onClick={handleDelete}><FontAwesomeIcon icon={faTrash} /></button>  
                <img src={book.image} className="img-fluid" alt="Portada del libro"></img>
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