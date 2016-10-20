import express from 'express';
import path from 'path';
import router from './routes/main.routes';
import http from 'http';
import fs from 'fs';
import socketIO from 'socket.io';

const app = express();
const server = http.Server(app);
const io = new socketIO(server);
const sockets = {};
const users = [];

app.use('/', router);
app.use(express.static(path.resolve(__dirname, '../', '../', 'dist')));

io.on('connection', function(socket) {
    console.log(socket);
    let name = socket.handshake.query.name;
    let currentUser = {
        id: socket.id,
        name
    };

    if (findIndex(users, currentUser.id) > -1) {
        console.log(`[INFO] User ${currentUser.name} is already connected, kicking.`);
        socket.disconnect();
    } else {
        sockets[currentUser.id] = socket; // store current socket with user.id key
        users.push(currentUser);
        io.emit('userConnect', { name: currentUser.name });
        console.log(`[INFO] User ${currentUser.name} is now connected.`);
        console.log(`[INFO] Total users:  ${users.length}`);
    }
});

const srv = app.listen(3000, function() {
    const {address, port} = srv.address(); // get address and port from srv.address()
    console.log(`App listening at http://${address}:${port}`);
});

export default app;
