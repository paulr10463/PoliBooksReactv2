import "../styles/footer.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTwitter, faInstagram, faFacebook } from '@fortawesome/free-brands-svg-icons'



const Footer = () => {

    

    return (
        <footer className="footer">
          <div className="container">
           <div className="row">
             <div className="footer-col">
               <h4>Poli Books</h4>
               <ul>
                 <li><a href="#">Sobre nosotros</a></li>
                 <li><a href="#">Servicio de libros</a></li>
                 <li><a href="#">Derechos de autor</a></li>
                 <li><a href="#">Sistema de ventas online</a></li>
               </ul>
             </div>
             <div className="footer-col">
               <h4>¿Necesitas ayuda?</h4>
               <ul>
                 <li><a href="#">FAQ</a></li>
                 <li><a href="#">Ventas</a></li>
                 <li><a href="#">Acuerdos</a></li>
                 <li><a href="#">Preguntas</a></li>
                 <li><a href="#">Formas de pago</a></li>
               </ul>
             </div>
             <div className="footer-col">
               <h4>Venta Online</h4>
               <ul>
                 <li><a href="#">Libros</a></li>
               </ul>
             </div>
             <div className="footer-col">
               <h4>Sigue nuestras redes</h4>
               <div className="social-links">
                 <a href="#"><FontAwesomeIcon className="faIcon" icon={faTwitter}/></a>
                 <a href="#"><FontAwesomeIcon className="faIcon" icon={faInstagram} /></a>
                 <a href="#"><FontAwesomeIcon className="faIcon" icon={faFacebook} /></a>
               </div>
             </div>
             <div className="footer-col">
              <h4>Derechos de autor</h4>
              <ul>
                <li><a href="#">Paúl Román</a></li>
                <li><a href="#">Gabriela Manobanda</a></li>
                <li><a href="#">David Yánez</a></li>
                <li><a href="#">Santiago Salazar</a></li>
              </ul>
            </div>
           </div>
          </div>
       </footer>
    )
}

export default Footer