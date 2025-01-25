import Header from '../../components/header.jsx';
import Navbar from '../../components/navbar.jsx';
import Footer from '../../components/footer.jsx';
import './OrdersPage.css';
import { useAuth } from '../../utils/authContext.jsx';
import LoadSpinner from '../../components/shared/loadSpinnerComponent/loadSpinnerComponent.jsx';
import { useOrders } from '../../hooks/useOrders.jsx';

export default function OrdersPage() {
    const { authData } = useAuth();
    const { orders, isLoading, error } = useOrders(authData.userID, authData.idToken);

    return authData.isAuthorized ? (
        <>
            <Header />
            <Navbar />
            <main className="orders-container">
                <h1>Tus órdenes</h1>

                {isLoading && (
                    <div className="loading-container">
                        <LoadSpinner />
                        <p>Cargando tus órdenes...</p>
                    </div>
                )}

                {/* Error State */}
                {error && (
                    <div className="error-container">
                        <p className="error-message">
                            Ocurrió un error al cargar tus órdenes. Por favor, intenta de nuevo más tarde.
                        </p>
                    </div>
                )}

                {/* Orders List */}
                {!isLoading && !error && (
                    <div className="order-list">
                        {orders.length === 0 ? (
                            <p className="no-orders-message">No tienes órdenes registradas.</p>
                        ) : (
                            orders.map((order) => (
                                <div className="order-card" key={order.id}>
                                    <div className="order-header">
                                        <h2>Order ID: {order.orderId}</h2>
                                        <p className={`order-status ${order.status.toLowerCase()}`}>
                                            {order.status}
                                        </p>
                                    </div>
                                    <div className="order-body">
                                        <p>
                                            <strong>Payer Name:</strong> {order.payer.name}
                                        </p>
                                        <p>
                                            <strong>Payer Email:</strong> {order.payer.email}
                                        </p>
                                        <p>
                                            <strong>Book ID:</strong> <a href={`/detail/${order.bookId}`}>{order.bookId}</a>
                                        </p>
                                        <p>
                                            <strong>Amount:</strong> {order.amount} {order.currency}
                                        </p>
                                        <p>
                                            <strong>Purchase Date:</strong> {new Date(order.purchaseDate).toLocaleString()}
                                        </p>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                )}
            </main>
            <Footer />
        </>
    ) : (
        <>
            {window.location.href = '/'} {/* Redirect to home if not authorized */}
        </>
    );
}
