const WebSocket = require('ws');
const https = require('https');
const express = require('express');
const path = require('path');
const fs = require('fs');
const jwt = require('jsonwebtoken');
const url = require('url');
const cors = require('cors'); // Import the CORS middleware

const app = express();

// Create a secret to be used for signing the JWTs.
const jwtSecret = process.env.JWTTOKEN;

// Create an array with user login credentials and information.
const userCredentials = [
    { "username": "userA", "password": "passwordA", "userId": 1, "userInfo": "I am userA." },
    { "username": "userB", "password": "passwordB", "userId": 2, "userInfo": "I am userB." },
    { "username": "userC", "password": "passwordC", "userId": 3, "userInfo": "I am userC." }
];

// SSL credentials
const server = https.createServer({
    cert: fs.readFileSync('cert.pem'),
    key: fs.readFileSync('key.pem')
}, app);

// Define the WebSocket server. Mounts to the `/ws` route of the Express server.
const wss = new WebSocket.Server({
    server: server,
    path: '/ws'
});

// Object to store WebSocket clients
const wsClients = {};

// Handle the WebSocket `connection` event
wss.on('connection', (ws, req) => {
    console.log('Client connected');
    const query = url.parse(req.url, true).query;
    const token = query.token;
    let wsUsername = "";

    jwt.verify(token, jwtSecret, (err, decoded) => {
        if (err) {
            ws.close();
        } else {
            wsClients[token] = ws;
            wsUsername = decoded.username;
        }
    });

    // Handle the WebSocket `message` event
    ws.on('message', (data) => {
        Object.keys(wsClients).forEach(token => {
            jwt.verify(token, jwtSecret, (err, decoded) => {
                if (err) {
                    wsClients[token].send("Error: Your token is no longer valid. Please reauthenticate.");
                    wsClients[token].close();
                    delete wsClients[token]; // Remove the client from the list
                } else {
                    wsClients[token].send(wsUsername + ": " + data);
                }
            });
        });
    });
});

// Middleware to allow cross-origin requests
app.use(cors());

// Serve static files from the 'client' directory
app.use(express.static(path.join(__dirname, '../client')));

// Serve index.html for the root route
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../client', 'index.html'));
});

// Authentication endpoint
app.get('/auth', (req, res) => {
    console.log('Authenticating user...');
    res.send(fetchUserToken(req));
});

// Function to fetch user token
const fetchUserToken = (req) => {
    const { username, password } = req.query;
    const user = userCredentials.find(u => u.username === username && u.password === password);
    if (user) {
        return jwt.sign(
            {
                "sub": user.userId,
                "username": username
            },
            jwtSecret,
            {
                expiresIn: 900 // Expire the token after 15 minutes.
            }
        );
    } else {
        return "Error: No matching user credentials found.";
    }
};

// Function to fetch user information
const fetchUserInfo = (userId) => {
    const user = userCredentials.find(u => u.userId === userId);
    if (user) {
        return user.userInfo;
    } else {
        return "Error: Unable to fulfill the request.";
    }
};

// Endpoint to fetch user information
app.get('/userInfo', (req, res) => {
    jwt.verify(req.query.token, jwtSecret, (err, decodedToken) => {
        if (err) {
            res.send(err);
        } else {
            res.send(fetchUserInfo(decodedToken.sub));
        }
    });
});

// Start the HTTPS server on port 5000
server.listen(5000, () => {
    console.log('WebSocket Server running on https://localhost:5000');
});
