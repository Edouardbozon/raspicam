import fs from 'fs';
import path from 'path';

export default class SocketService {

    constructor(io, app) {
        this.io = io;
        this.app = app;
        this.spawn = require('child_process').spawn;

        this.users = [];
        this.sockets = {};

        this.io.on('connection', this.connection.bind(this));

        this.fileName = 'stream_n' + Date.now();
        this.streamPath = path.resolve(__dirname, '../', '../', '../', 'dist', `${this.fileName}.jpg`);
    }

    connection(socket) {
        this.sockets[socket.id] = socket;
        const currentUser = {
            id: socket.id,
            tag: socket.handshake.query.tag,
            type: socket.handshake.query.type
        };

        this.users.push(currentUser);
        this.bindSocketEvents(socket, currentUser);
        this.startStream();

        console.log(`[INFO] User ${currentUser.name} is now connected.`);
        console.log(`[INFO] Total users:  ${this.users.length}`);

        this.onDisconnect(socket, currentUser);
    }

    bindSocketEvents(socket, currentUser) {
        socket.broadcast.emit('user:connect', { user: currentUser }); // send new connected user data to all connected users except sender
        socket.emit('users:list', { users: this.users }); // send connected users list to new user
    }

    onDisconnect(socket, currentUser) {
        socket.on('disconnect', () => {
            delete this.sockets[socket.id];
            this.io.emit('user:disconnect', { user: currentUser }); // emit user deconnection to each connected user
            this.users.forEach((user, i) => { // clear disconncted user
                if (user.id === currentUser.id) {
                    this.users.splice(i, 1);
                }
            });
            console.log(`
                ------------------- [INFO] --------------------
                - User ${currentUser.name} LEFT Raspicam
                - Total users:  ${this.users.length}
                -----------------------------------------------
            `);
            if (Object.keys(this.sockets).length === 0) {
                this.app.set('watchingFile', false);
                if (this.proc) this.proc.kill();
                fs.unwatchFile(this.streamPath);
            }
        });
    }

    startStream() {
        if (this.app.get('watchingFile')) {
            this.io.sockets.emit('liveStream', `${this.fileName}.jpg?_t=` + (Math.random() * 100000));
            return;
        }

        const args = ["-w", "640", "-h", "480", "-o", this.streamPath, "-t", "999999999", "-tl", "100"];
        this.proc = this.spawn('raspistill', args);

        console.log('[INFO] Watching for changes...');

        this.app.set('watchingFile', true);
        fs.watchFile(this.streamPath, (current, previous) => {
            this.io.sockets.emit('liveStream', `${this.fileName}.jpg?_t=` + (Math.random() * 100000));
        })
    }
}
