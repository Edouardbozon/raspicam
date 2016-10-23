export default class SocketService {

    constructor(io) {
        this.io = io;
        this.sockets = [];
        this.users = [];
        this.io.on('connection', this.connection.bind(this));
    }

    connection(socket) {

        // for (let variable in socket.handshake.query) {
            console.log(socket.handshake.query);
        // }
        const currentUser = {
            id: socket.id,
            tag: socket.handshake.query.tag,
            type: socket.handshake.query.type
        };

        // this.sockets.push(socket); // store current socket with user.id key
        this.users.push(currentUser);

        this.bindSocketEvents(socket, currentUser);

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
        });
    }
}
