export default class mainController {
    constructor(Socket, $scope) {
        'ngInject';

        this.Socket = Socket;
        this.$scope = $scope;

        this.currentUser = {
            id: null,
            name: null,
            email: null,
            preference: null
        };

        this.users = this.Socket.data.users;
        this.preferences = ['Bacon', 'Falafel', 'Eggs', 'Porridge'];
        this.$scope.$on('$destroy', this.disconnect.bind(this));
    }

    isConnected() {
        return this.Socket.data.isConnected;
    }

    connect() {
        return this.Socket.connect(this.currentUser);
    }

    disconnect() {
        return this.Socket.disconnect();
    }

}
