const express = require('express');
const http = require('http');

const app = express();
const server = http.createServer(app);
const { Server } = require('socket.io');
const io = new Server(server);

const port = 3000;

app.use(express.static('public'));

app.get('/', (req, res) => {
    res.send('Hello World!');
});

const users = {};

io.on('connection', (socket) => {
    users[socket.id] = socket;

    io.emit('userList', Object.keys(users));

    socket.on('sendMessage', ({ content, sender, recipient }) => {
        console.log(`Message received: ${content} | From: ${sender} | To: ${recipient}`);

        if (users[recipient]) {
            console.log(`Forwarding message to ${recipient}`);
            users[recipient].emit('message', { sender, content });
        } else {
            console.log(`Recipient ${recipient} not found.`);
        }
    });

    socket.on('disconnect', () => {
        delete users[socket.id];
        io.emit('userList', Object.keys(users));
    });
});

server.listen(port, () => {
    console.log(`Server listening at http://localhost:${port}`);
});
