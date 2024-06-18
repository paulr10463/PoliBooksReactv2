import { useEffect, useState } from "react";
import "../styles/header.css"
import LoginModal from "./loginModal";
import { useAuth } from '../utils/authContext';
import { infoToast } from "../utils/toast";



const Header = () => {
  const [ isModalOpen, setIsModalOpen ] = useState(false);
  const [ buttonValue , setButtonValue ] = useState("Iniciar sesión");
  const { authData, setAuthorization } = useAuth();

  useEffect(() => {
    console.log(authData);
    if (!authData){ setButtonValue("Iniciar sesión"); return;}
    authData.isAuthorized ?setButtonValue("Cerrar sesión"):setButtonValue("Iniciar sesión");  
    console.log(authData.isAuthorized); 
  }, [authData]);

  const openModal = () => {
    if (!authData || !authData.isAuthorized) { setIsModalOpen(true); return;}
      setAuthorization({isAuthorized: false, idToken: null, userID: null});
      setButtonValue("Iniciar sesión");
      infoToast("Cierre de sesión exitoso");
  };

  const handleRedirect = () => {
    window.location.href = "/register";
  };

  const handleMyBooks = () => {
    window.location.href = "/seller";
  };

  return (
    <>
    <div id="header">
      <a href="/" className="logo"><svg width="30" height="35" viewBox="0 0 22 28" fill="none" xmlns="http://www.w3.org/2000/svg">
<g clipPath="url(#clip0_49_9)">
<path d="M8.46 15L4.04 8.81999V15H0.119995V0.899994H4.04V6.97999L8.42 0.899994H12.94L7.76 7.73999L13.2 15H8.46Z" fill="white"/>
<path d="M8.46 28L4.04 21.82V28H0.119995V13.9H4.04V19.98L8.42 13.9H12.94L7.76 20.74L13.2 28H8.46Z" fill="white"/>
<path d="M12.2422 23.2422C11.1172 23.2422 10.1458 23.0417 9.3281 22.6406C8.51563 22.2396 7.89062 21.7005 7.45312 21.0234C7.01562 20.3411 6.79688 19.5833 6.79688 18.75C6.79688 18.1354 6.91667 17.5937 7.15625 17.125C7.40104 16.651 7.73697 16.2161 8.16405 15.8203C8.59634 15.4193 9.099 15.026 9.6719 14.6406L13.0313 12.4922C13.4115 12.2526 13.6797 12 13.8359 11.7344C13.9974 11.4687 14.0781 11.2031 14.0781 10.9375C14.0781 10.651 13.9661 10.3906 13.7422 10.1563C13.5234 9.92189 13.1979 9.80729 12.7656 9.81249C12.4896 9.81249 12.25 9.86979 12.0469 9.98439C11.8438 10.099 11.6849 10.2526 11.5703 10.4453C11.4609 10.638 11.4063 10.8568 11.4063 11.1016C11.4063 11.4193 11.4974 11.7448 11.6797 12.0781C11.862 12.4115 12.1068 12.7656 12.4141 13.1406C12.7266 13.5156 13.0729 13.9297 13.4531 14.3828L21.1172 23H17.2266L10.8125 16.0391C10.4479 15.6328 10.0651 15.1771 9.66409 14.6719C9.26299 14.1667 8.92448 13.6146 8.64844 13.0156C8.3724 12.4115 8.23438 11.7552 8.23438 11.0469C8.23438 10.25 8.42188 9.52859 8.79688 8.88279C9.17189 8.23699 9.6979 7.72399 10.375 7.34369C11.0573 6.95829 11.8516 6.76559 12.7578 6.76559C13.6328 6.76559 14.388 6.94529 15.0234 7.30469C15.6589 7.66409 16.1484 8.14059 16.4922 8.73439C16.8359 9.32809 17.0078 9.97919 17.0078 10.6875C17.0078 11.4375 16.8229 12.1276 16.4531 12.7578C16.0833 13.3828 15.5599 13.9375 14.8828 14.4219L11.5938 16.7734C11.2448 17.0234 10.9714 17.2917 10.7734 17.5781C10.5755 17.8594 10.4766 18.1667 10.4766 18.5C10.4766 18.8437 10.5573 19.1432 10.7188 19.3984C10.8854 19.6536 11.1198 19.8542 11.4219 20C11.724 20.1458 12.0781 20.2188 12.4844 20.2188C13.026 20.2188 13.5677 20.0911 14.1094 19.8359C14.651 19.5755 15.1458 19.2109 15.5938 18.7422C16.0417 18.2682 16.401 17.7083 16.6719 17.0625C16.9427 16.4115 17.0781 15.6979 17.0781 14.9219H20.1563C20.1563 15.8802 20.0547 16.7708 19.8516 17.5937C19.6484 18.4115 19.3438 19.1458 18.9375 19.7969C18.5365 20.4427 18.0391 20.9792 17.4453 21.4062C17.2578 21.5104 17.0755 21.6094 16.8984 21.7031C16.7214 21.7969 16.5391 21.8958 16.3516 22C15.737 22.4427 15.0703 22.7604 14.3516 22.9531C13.638 23.1458 12.9349 23.2422 12.2422 23.2422Z" fill="white"/>
</g>
<defs>
<clipPath id="clip0_49_9">
<rect width="22" height="28" fill="white"/>
</clipPath>
</defs>
</svg></a>
      <div className="button-container">
        <input onClick={openModal} className="btn-buy" type="button" value={buttonValue}></input>
        {
          authData && authData.isAuthorized && <input onClick={handleMyBooks}  className="btn-buy" type="button" value="Mis libros"></input>
        }
        {
          !authData.isAuthorized && <input onClick={handleRedirect}  className="btn-buy" type="button" value="Registrarse"></input>
        }
        
      </div>
    </div>
    
    <LoginModal isOpen={isModalOpen} onRequestClose={() => setIsModalOpen(false)} />

    </>
  )
};
//
export default Header;

