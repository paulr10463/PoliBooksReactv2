import React from 'react'
import ReactDOM from 'react-dom/client'
import AOS from 'aos';
import 'aos/dist/aos.css';
import App from './app.jsx';
import './styles/index.css';

AOS.init();

ReactDOM.createRoot(document.getElementById('root')).render(
    <>
        <App />
    </>
)
