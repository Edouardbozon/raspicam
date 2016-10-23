export default class SocketService {

    constructor(io) {
        this.io = io;
        this.sockets = [];
        this.users = [];
        this.io.on('connection', this.connection.bind(this));
    }

    connection(socket) {
        const currentUser = {
            id: socket.id,
            name: socket.handshake.query.name
        };

        this.sockets.push(socket); // store current socket with user.id key
        this.users.push(currentUser);

        this.bindSocketEvents(socket, currentUser);

        console.log(`[INFO] User ${currentUser.name} is now connected.`);
        console.log(`[INFO] Total users:  ${this.users.length}`);

        this.onDisconnect(socket, currentUser);
    }

    bindSocketEvents(socket, currentUser) {
        this.io.emit('user:connect', { user: currentUser }); // send new User data to all connected users
        socket.emit('users:list', { users: this.users }); // send all users data to current user
    }

    onDisconnect(socket, currentUser) {
        socket.on('disconnect', () => {
            this.io.emit('user:disconnect', { user: currentUser });
            this.sockets.filter((filteredSocket) => { // clear socket
                if (filteredSocket.id === socket.id) {
                    return false;
                }
                return true;
            });
            this.users.filter((filteredUser) => { // clear user
                if (filteredUser.id === currentUser.id) {
                    return false;
                }
                return true;
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
