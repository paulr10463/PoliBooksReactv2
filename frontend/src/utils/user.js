import { environment } from "../environment/environment.prod";

async function signIn(userData) {
    try {

      const response = await fetch(`${environment.HOST}/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData)
      });
  
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