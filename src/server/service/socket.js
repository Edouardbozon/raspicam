import fs from 'fs';
import path from 'path';
import raspivid from 'raspivid';

export default class SocketService {

    constructor(io, app) {
        this.io = io;
        this.app = app;

        this.users = [];
        this.sockets = {};

        this.io.on('connection', this.connection.bind(this));
        this.fileName = 'stream_n' + Date.now();
        this.streamPath = path.resolve(__dirname, '../', '../', '../', 'dist', `${this.fileName}.h264`);
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
            }
        });
    }

    startStream() {
        try {
            const videoProcess = raspivid({
                width: 640,
                height: 480
            });
            const videoOutput = fs.createWriteStream(this.streamPath);
            this.stream = videoProcess.pipe(videoOutput);
            this.io.sockets.emit('liveStream', this.streamPath);
            this.app.set('watchingFile', true);
        } catch (e) {
            console.log(e);
        }
    }
}
