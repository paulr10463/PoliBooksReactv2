    import React from 'react'
    import { useState } from 'react';
    import ProductDetailPage from './pages/ProductDetailPage.jsx';
    import CreateBookPage from './pages/CreateBookPage.jsx';
    import 'aos/dist/aos.css';
    import UpdateBookPage from './pages/UpdateBookPage.jsx';
    import SellerProfilePage from './pages/SellerProfilePage.jsx';
    import LandingPage from './pages/LandingPage.jsx';
    import SearchBookPage from './pages/SearchBookPage.jsx';
    import {  createBrowserRouter,  RouterProvider,} from "react-router-dom";
    import RegisterUserPage from './pages/RegisterUserPage.jsx';
    import { AuthProvider } from './utils/authContext.jsx';
    import { ToastContainer } from 'react-toastify';
    import 'react-toastify/dist/ReactToastify.css';

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
        ]);
        
        
        return (
            <AuthProvider>
                <RouterProvider router={router} />
                <ToastContainer />
            </AuthProvider>  
        )
    }

    export default App
