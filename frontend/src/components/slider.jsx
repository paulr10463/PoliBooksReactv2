import BookSlider from './bookSlider'
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, A11y } from 'swiper/modules';
import 'swiper/swiper-bundle.css';
import "../styles/slider.css"
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import { useEffect, useState } from 'react';

const Slider = () => {
    const [books, setBooks] = useState([]);

    useEffect(() => {
        fetch('http://localhost:3000/api/read/books/3')
            .then(response => response.json())
            .then(data => setBooks(data))
        console.log(books)
    }, [])

    return (
        <section id="testimonials" className="testimonials">
            <Swiper
                className='testimonials-slider swiper'
                modules={[Navigation, Pagination, A11y]}
                spaceBetween={0}
                slidesPerView={1}
                navigation
                pagination={{ clickable: true }}
            >
                {books && books.length > 0 ? (
                    books.map((book, index) => (
                        <SwiperSlide key={index} className='swiper-slide'>
                            <BookSlider book={book} />
                        </SwiperSlide>
                    ))) : (
                    <p>No se encontraron libros.</p>
                )}
            </Swiper>
        </section>
    );
}

export default Slider
