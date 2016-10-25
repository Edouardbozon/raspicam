export default class mainController {
    constructor(Socket, $scope) {
        'ngInject';

        this.Socket = Socket;
        this.$scope = $scope;

        this.user = { // user's given informations
            id: null,
            tag: null,
            type: null
        };
        this.types = ['friend', 'voyerist', 'psychopath', 'criminal']; // user types

        this.users = this.Socket.data.users; // live users
        this.streamUrl = this.Socket.data.streamUrl; // live users
        this.$scope.$on('$destroy', this.disconnect.bind(this));
    }

    isConnected() {
        return this.Socket.data.isConnected;
    }

    connect() {
        return this.Socket.connect(this.user);
    }

    disconnect() {
        return this.Socket.disconnect();
    }

}
