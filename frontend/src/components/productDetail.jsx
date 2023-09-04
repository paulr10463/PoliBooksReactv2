import { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/css/bootstrap.css";
import "../styles/productDetail.css";
import Stars from './micro-components/stars.jsx';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, A11y } from 'swiper/modules';
import 'swiper/swiper-bundle.css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';


const ProductDetail = ({book}) => {
    function handleBuy() {
        window.location.href = `https://wa.me/593${book.contact}?text=Hola, estoy interesado en comprar el libro ${book.title}`;
    }

    return (
        <section className="product-detail">
            <div className="left-detail">
                <Swiper
                    className='product-detail-swiper'
                    modules={[Navigation, Pagination, A11y]}
                    spaceBetween={0}
                    slidesPerView={1}
                    navigation
                    pagination={{ clickable: true }}
                >
                    {book.image.map((url, index) => (
                        <SwiperSlide key={index}>
                            <img src={url} alt="imagen del libro" />
                        </SwiperSlide>
                    ))}
                </Swiper>
                <div className="product-detail-rating"> Estado: <Stars rating={5} /></div>
            </div>
            <div className="right-detail">
                <h1 className="product-detail-title"><b>{book.title}</b></h1>

                <table className="grid-table">
                    <tr>
                        <td><strong>Descripción:</strong></td>
                        <td>{book.description}</td>
                    </tr>
                    <tr>
                        <td><strong>Marca:</strong></td>
                        <td>{book.brand}</td>
                    </tr>
                    <tr>
                        <td><strong>Institución:</strong></td>
                        <td>{book.institution}</td>
                    </tr>
                    <tr>
                        <td><strong>Nivel:</strong></td>
                        <td>{book.level}</td>
                    </tr>
                    <tr>
                        <td><strong>Precio</strong></td>
                        <td>{book.price}</td>
                    </tr>
                    <tr>
                        <td><strong>Contacto:</strong></td>
                        <td>{book.contact}</td>
                    </tr>
                </table>
                <button class="buy-button" onClick={handleBuy}>Comprar</button>
            </div>

        </section>
    );
}


export default ProductDetail;
