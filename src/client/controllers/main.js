export default class mainController {
    constructor(Socket, $scope) {
        'ngInject';

        this.Socket = Socket;
        this.$scope = $scope;

        // this.Socket.connect();
        this.users = this.Socket.data.users;
        this.$scope.$on('$destroy', this.disconnect.bind(this));
    }

    isConnected() {
        return this.Socket.data.isConnected;
    }

    connect() {
        return this.Socket.connect();
    }

    disconnect() {
        return this.Socket.disconnect();
    }

}
