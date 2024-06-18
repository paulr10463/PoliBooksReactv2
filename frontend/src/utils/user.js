let ws;

import { loginJWT } from "../services/auth.service";

async function signIn(userData) {
    try {
      const response = await loginJWT(userData);
  
      if (response.ok) {
        const data = await response.json();
        return data;
      } else {
        console.error('Error en la respuesta:', response.status);
        return null;
      }
    } catch (error) {
      console.error('Error al hacer la solicitud:', error);
      return null;
    }
  }

  const signOut = () => {
    return null;    
  };


export { signIn, signOut };