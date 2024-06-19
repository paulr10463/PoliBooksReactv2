// Se importan componentes y utilidades necesarios.
import Header from '../components/header.jsx'
import Navbar from '../components/navbar.jsx'
import Footer from '../components/footer.jsx'
import SellerProfileBox from '../components/sellerProfileBox.jsx'
import SellerProfileBook from '../components/micro-components/sellerProfileBook.jsx'
import '../styles/index.css'
import '../styles/sellerProfilePage.css'
import { useAuth } from '../utils/authContext.jsx'
import { useBooksByUserId } from '../hooks/useBooks.jsx'
import LoadSpinner from '../components/shared/loadSpinnerComponent/loadSpinnerComponent.jsx'

export default function SellerProfilePage() {
    const { authData } = useAuth();
    const {books, isLoading, error} = useBooksByUserId(authData.userID,authData.idToken )

    
    return (
        authData.isAuthorized ? ( // Verifica si el usuario está autorizado
            <>
                <Header />
                <Navbar />
                <SellerProfileBox />
                <div className='seller-books-container'>
                    {error}
                    {isLoading && <LoadSpinner/> }
                    {books && books.length > 0 ? (
                        books.map((book, index) => (
                            <SellerProfileBook key={index} book={book} />
                        ))
                    ) : (
                        
                        <p>No se encontraron libros.</p>
                    )}
                </div>
                <Footer />
            </>
        ) : (
            <>
                {window.location.href = '/'}
            </>
        )
    );
}
