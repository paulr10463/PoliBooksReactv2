import BookSlider from './bookSlider'
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, A11y } from 'swiper/modules';
import 'swiper/swiper-bundle.css';
import "../styles/slider.css"
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import { useBooks } from '../hooks/useBooks';
import LoadSpinner from './shared/loadSpinnerComponent/loadSpinnerComponent';

const Slider = () => {
    const { books, isLoading, error } = useBooks(5);

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
                    <div style={{ textAlign: "center" }}>
                        <LoadSpinner />
                    </div>
                )}
            </Swiper>
        </section>
    );
}

export default Slider
