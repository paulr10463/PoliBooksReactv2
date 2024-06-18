let ws;

import { loginJWT } from "../services/auth.service";

async function signIn(userData) {
    try {
      const response = await loginJWT(userData);
  
      if (response.ok) {
        const data = await response.json();

        // open ws
        console.log("responses:" + response);
        console.log("datasss: " + data.message);
        console.log("datasss: " + data.token);
        openWsConnection(response);

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

  const openWsConnection = (jwtAuth) => {
    if (ws) {
        ws.close();
    }

    ws = new WebSocket("wss://localhost:3000/ws?token=" + jwtAuth);

    ws.onopen = (event) => {
        console.log("WebSocket connection established.");
        //ws.send("WS Open!");
    }

    ws.onmessage = (event) => {
        console.log("WebSocket message received: ", event.data);

        if (event.data.includes("Error")) {
            //errorMessageSpan.innerHTML = event.data;
            console.log("Error message received: ", event.data);
        } else {
            //newMessageDiv = document.createElement("div");
            //newMessageDiv.textContent = event.data;

            //messageDiv.appendChild(newMessageDiv);

            console.log("Message received: ", event.data);
        }
    }

    ws.onerror = (event) => {
        console.log("WebSocket error received: ", event);
    }

    ws.onclose = (event) => {
        console.log("WebSocket connection closed.");
    }
  }

export { signIn, signOut };