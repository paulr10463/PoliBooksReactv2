import React from "react";
import "./Payment.css";
import { useAuth } from "../../utils/authContext.jsx";
import { PayPalButtons, PayPalScriptProvider } from "@paypal/react-paypal-js";
import Swal from "sweetalert2";
import { confirmPayment } from "../../services/payment.service.js";

export default function Payment({ book }) {
    const DEFAULT_IMAGE =
        "https://firebasestorage.googleapis.com/v0/b/polibooksweb.appspot.com/o/polibooks%2FnotAvailableBook.png?alt=media&token=0b68b219-5e8a-4652-92d5-7b1ddcd2d129";
    const { authData } = useAuth();

    const handlePayPalApprove = async (orderID) => {
        Swal.fire({
            title: "Processing Payment",
            text: "Please wait while we process your payment.",
            allowOutsideClick: false,
            didOpen: () => {
                Swal.showLoading();
            },
        });
        try {
            await confirmPayment(orderID, book.id, authData.userID, authData.idToken);
        
            // Payment confirmed successfully
            Swal.fire({
                icon: "success",
                title: "Payment Successful",
                text: "Your payment has been processed successfully.",
                didClose: () => {
                    window.location.href = "/"; // Redirect to home after payment
                },
            });
        } catch (error) {
            // Handle errors
            console.error("Error communicating with backend:", error.message);
            Swal.fire({
                icon: "error",
                title: "Payment Failed",
                text: error.message.includes("Failed to verify payment")
                    ? "There was an issue confirming your payment with the server."
                    : "Unable to process the payment due to a network issue. Please try again.",
            });
        }
        
    };

    return authData.isAuthorized ? (
        <div className="payment-container">
            <h1>Procesar Pago</h1>
            <div className="payment-container-content">
                {book && (
                    <div className="book-preview">
                        <h2>{book.title}</h2>
                        <div className="book-preview-details">
                            <div className="book-preview-image">
                                {book.image.length > 0 ? (
                                    <img src={book.image[0]} alt={`Imagen de ${book.title}`} />
                                ) : (
                                    <img src={DEFAULT_IMAGE} alt="Imagen no disponible" />
                                )}
                            </div>
                            <div className="book-preview-info">
                                <p>
                                    <strong>Descripción:</strong> {book.description}
                                </p>
                                <p>
                                    <strong>Marca:</strong> {book.brand}
                                </p>
                            </div>
                        </div>
                    </div>
                )}

                <div className="payment-form">
                    <PayPalScriptProvider
                        options={{
                            clientId: "AdQ2chWmuDjQbzwXSmX0q2QePFnlyZEDKjoZdCAPmDeAfZbpE25OUS-VsenvxkUuoOKoPbwlv5nZsmiX",
                            currency: "USD",
                        }}
                    >
                        <PayPalButtons
                            style={{ layout: "vertical" }}
                            createOrder={(data, actions) => {
                                return actions.order.create({
                                    purchase_units: [
                                        {
                                            amount: {
                                                value: book.price.toFixed(2),
                                            },
                                            description: book.title,
                                        },
                                    ],
                                });
                            }}
                            onApprove={(data, actions) => {
                                return actions.order.capture().then((details) => {
                                    handlePayPalApprove(details.id);
                                });
                            }}
                            onError={(err) => {
                                console.error("Error in PayPal:", err);
                                Swal.fire({
                                    icon: "error",
                                    title: "PayPal Error",
                                    text: "There was an issue processing your payment with PayPal.",
                                });
                            }}
                        />
                    </PayPalScriptProvider>
                </div>
            </div>
        </div>
    ) : (
        <>{(window.location.href = "/")}</> // Redirect to home if not authorized
    );
}
