import "../styles/navbar.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons'
import { faChevronRight } from '@fortawesome/free-solid-svg-icons'
import { faChevronDown } from '@fortawesome/free-solid-svg-icons'
import { useAuth } from '../utils/authContext';
import { useEffect, useState } from "react";
import { redirect } from "react-router-dom";

const Navbar = () => {
 
    function handleSearch() {
        const searchInputValue = document.getElementById("navbar-search-input").value;
        window.location.href = `/search/books?title=${encodeURIComponent(searchInputValue)}`;
    }

    useEffect(() => {
        const searchInput = document.getElementById("navbar-search-input");
        searchInput.addEventListener("keydown", handleKeyDown);
        return () => {
            searchInput.removeEventListener("keydown", handleKeyDown);
        };
    }, []);

    const handleKeyDown = (event) => {
        if (event.key === 'Enter') {
          // Ejecuta la acción aquí
          handleSearch();
        }
      };

    const { authData } = useAuth();
    return (
        <nav id="navbar" >
            <ul>
                <li><a className="nav-link scrollto" href="/">Inicio</a></li>
                <li className="dropdown"><a className="nav-link" href="/search/books?title="><span>Categorías</span> <FontAwesomeIcon className= "down_chevron" icon={faChevronDown} /> </a>
                    <ul>
                        <li className="dropdown"><a href="/search/books?title="><span>Idiomas</span> <FontAwesomeIcon icon={faChevronRight} /> </a>
                            <ul>
                                <li><a href="/search/books?title=Ingles">Inglés</a></li>
                                <li><a href="/search/books?title=Frances">Francés</a></li>
                            </ul>
                        </li>
                        <li className="dropdown"><a href="/search/books?title="><span>Niveles</span> <FontAwesomeIcon icon={faChevronRight} /> </a>
                            <ul>
                                <li><a href="/search/books?title=academico">Academico</a></li>
                                <li><a href="/search/books?title=principiante">Principiante</a></li>
                                <li><a href="/search/books?title=avanzado">Avanzado</a></li>
                                <li><a href="/search/books?title=basico">Básico</a></li>
                            </ul>
                        </li>
                        
                    </ul>
                </li>
                {authData.isAuthorized && <li><a className="nav-link scrollto" href="/seller">Vender</a></li>}
                {authData.isAuthorized && <li><a className="nav-link scrollto" href="/seller">Chat</a></li>}
                
                <li><a className="nav-link" href="#services"nav-link scrollto>Quienes Somos</a></li>
            </ul>

            <div className="search-bar">
                <FontAwesomeIcon className="search-icon" icon={faMagnifyingGlass} />
                <input id="navbar-search-input" className="search-input" type="text" placeholder="Buscar"></input>
                <input onClick={handleSearch} className="search-button" type="submit" value="Buscar"></input>
            </div>
        </nav>
    )
}

export default Navbar