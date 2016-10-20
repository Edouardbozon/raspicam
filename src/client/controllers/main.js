export default class mainController {
    constructor(Socket) {
        'ngInject';
        this.Socket = Socket;
        this.currentPage = 'home';
    }

    isConnected(){
        return this.Socket.isConnected;
    }
}