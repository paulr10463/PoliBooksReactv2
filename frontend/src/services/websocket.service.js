
const socket = new WebSocket('ws://localhost:5000');

const chatMessages = [];

socket.addEventListener('open', (event) => {
    socket.send('Hello, server!');
});

//socket.onmessage = (event) => { };
socket.addEventListener('message', (event) => {
    event.data.arrayBuffer().then((data) => {
        const message = new TextDecoder('utf-8').decode(data);
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