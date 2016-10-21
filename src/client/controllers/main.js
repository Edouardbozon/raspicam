export default class mainController {
    constructor(Socket) {
        'ngInject';
        this.Socket = Socket;
        this.Socket.connect().then(()=> {
            this.currentPage = 'home';
            this.users = this.Socket.users;
        });
        console.log(this.users)
    }

    isConnected(){
        return this.Socket.isConnected;
    }

    getUsers(){
        return this.Socket.users;
    }
}