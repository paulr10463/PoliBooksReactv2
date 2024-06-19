
const socket = new WebSocket('wss://localhost:5000');

const chatMessages = [];

socket.addEventListener('open', (event) => {
    console.log('Connection established with the WebSocket server');
    socket.send('Hello, server!');
});

//socket.onmessage = (event) => { };
socket.addEventListener('message', (event) => {
    event.data.arrayBuffer().then((data) => {
        const message = new TextDecoder('utf-8').decode(data);
        //console.log(message); 
        chatMessages.push(message);
    });
}); 


function sendMessage(message) {
    if (socket.readyState === WebSocket.OPEN) {
        socket.send(message);
    }
}

function getMessages() {
    return chatMessages;
}