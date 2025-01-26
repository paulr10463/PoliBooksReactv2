let ws;
let messageDiv = document.querySelector("#messages");
let errorMessageSpan = document.querySelector("#errorMessage");

const getJwtAuth = (username, password) => {
    fetch("https://localhost:5000/auth?username=" + username + "&password=" + password)
    .then(response => response.text())
        .then(response => {
            if (response.includes("Error")) {
                errorMessageSpan.innerHTML = response;
            } else {
                errorMessageSpan.innerHTML = "";
                openWsConnection(response);
            }
        })
        .catch(err => console.error(err));
}

const sendWsMessage = () => {
    let messageContent = document.querySelector("#messageContent").value;
    if (ws) {
        if (messageContent.trim() !== "") {
            ws.send(messageContent);
        } else {
            errorMessageSpan.innerHTML = "Error: Message content cannot be empty.";
        }
    } else {
        errorMessageSpan.innerHTML = "Error: You must log in to send a message.";
    }
}

const openWsConnection = (jwtAuth) => {
    if (ws) {
        ws.close();
    }
    ws = new WebSocket("wss://localhost:5000/ws?token=" + jwtAuth);
    

    ws.onmessage = (event) => {
        if (event.data.includes("Error")) {
            errorMessageSpan.innerHTML = event.data;
        } else {
            let newMessageDiv = document.createElement("div");
            newMessageDiv.textContent = event.data;
            messageDiv.appendChild(newMessageDiv);
        }
    };

    ws.onerror = (event) => {
        console.error("WebSocket error received: ", event);
    };

};
