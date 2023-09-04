import React from 'react';
import '../styles/sellerProfileBox.css'

const SellerProfileBox = () => {
    return (
        <div className="row">
                <div className="main-box">
                    <div className="inner-box">
                        <h3>Publicar</h3>
                        <p> Ahora tiene la posibilidad de comercializar libros educativos en diferentes
                            presentaciones, como libros de tapa blanda y libros de tapa dura.</p>   
                    </div>
                    <a href="/create" className="btn btn-primary">+</a>
            </div>
        </div>
    );
};

export default SellerProfileBox;