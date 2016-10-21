export default class SocketService {

    constructor(io) {
        this.sockets = {};
        this.users = [];
        this.initialize(io);
    }

    initialize(io) {
        io.on('connection', (socket) => {
            this.currentUser = {
                id: socket.id,
                name: socket.handshake.query.name
            };
            if (this.users.indexOf(this.currentUser.id) > -1) {
                console.log(`[INFO] User ${this.currentUser.name} is already connected, kicking.`);
                socket.disconnect();
            } else {
                this.sockets[this.currentUser.id] = socket; // store current socket with user.id key
                this.users.push(this.currentUser);
                io.emit('userConnect', { users: this.users });
                console.log(`[INFO] User ${this.currentUser.name} is now connected.`);
                console.log(`[INFO] Total users:  ${this.users.length}`);
            }
        });
    }
} 