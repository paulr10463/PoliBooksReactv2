const WebSocket = require('ws');
const http = require('http');
const express = require('express');
const path = require('path');
const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

wss.on('connection', (ws) => {
    ws.on('message', (message) => {
        console.log(message);
        wss.clients.forEach((client) => {
            if (client !== ws && client.readyState === WebSocket.OPEN) {
                client.send(message);
            }
        });
    });
});

app.use(express.static(path.join(__dirname, '../client')));
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, "../client", 'index.html'));
}); server.listen(5000, () => {
    console.log('Servidor WebSocket en ejecución en el puerto 3000');
});


