import Stars from './micro-components/stars.jsx'
import "../styles/bookSlider.css"

const BookSlider = ({book}) => {

    function handleClick() {
        window.location.href = `/detail/${book.id}`;
    }

    return (
        <div className="testimonial-item" data-aos="zoom-in" data-aos-duration="1000">
            <img src={book.image} className="testimonial-img" alt="book for sale"></img>
            <div className="testimonial-text">
                <h1>{book.title}</h1>
                <h3>{book.description}</h3>
                <div className="star-container">
                    <h4>Estado:</h4>
                    <Stars rating={5} />
                </div>
                
            </div>
            <div className="testimonial-text-description">
                <input onClick={handleClick} type="button" value="Ver más"></input>
            </div>
        </div>
    );
};

export default BookSlider;