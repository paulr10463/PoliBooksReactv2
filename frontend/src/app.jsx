    import React from 'react'
    import { useState } from 'react';
    import ProductDetailPage from './pages/ProductDetailPage.jsx';
    import CreateBookPage from './pages/CreateBookPage.jsx';
    import 'aos/dist/aos.css';
    import UpdateBookPage from './pages/UpdateBookPage.jsx';
    import SellerProfilePage from './pages/SellerProfilePage.jsx';
    import LandingPage from './pages/LandingPage.jsx';
    import PaymentPage from './pages/PaymentPage/PaymentPage.jsx';
    import SearchBookPage from './pages/SearchBookPage.jsx';
    import {  createBrowserRouter,  RouterProvider,} from "react-router-dom";
    import RegisterUserPage from './pages/RegisterUserPage.jsx';
    import { AuthProvider } from './utils/authContext.jsx';
    import { ToastContainer } from 'react-toastify';
    import 'react-toastify/dist/ReactToastify.css';
    import ChatPage from './pages/ChatPage/ChatPage.jsx';
    import OrdersPage from './pages/OrdersPage/OrdersPage.jsx';
    import AdminPage from './pages/AdminPage/AdminPage.jsx';

    function App() {
        const router = createBrowserRouter([
            {
            path: "/",
            element: <LandingPage />,
            },
            {
                path: "/register",
                element: <RegisterUserPage />,
            },
            {
                path: "/detail/:bookID",
                element: <ProductDetailPage />,
            },
            {
                path: "/create",
                element: <CreateBookPage />,
            },
            {
                path: "/seller",
                element: <SellerProfilePage />,
            },    
            {
                path: "/update/:bookID",
                element: <UpdateBookPage />,
            },    
            {
                path: "/search/books",
                element: <SearchBookPage />,
            },
            {
                path:"/chat",
                element: <ChatPage />
            },
            {
                path: "/payment",
                element: <PaymentPage />,
            },
            {
                path: "/orders",
                element: <OrdersPage />,
            },
            {
                path: "/admin",
                element: <AdminPage />,
            }
        ]);
        
        
        return (
            <AuthProvider>
                <RouterProvider router={router} />
                <ToastContainer />
            </AuthProvider>  
        )
    }

    export default App
