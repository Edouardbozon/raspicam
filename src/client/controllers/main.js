export default class mainController {
    constructor(Socket, $scope, $log) {
        'ngInject';

        this.Socket = Socket;
        this.$scope = $scope;
        this.$log = $log;

        this.user = { // user's given informations
            id: null,
            tag: null,
            type: null
        };
        this.types = ['friend', 'voyerist', 'psychopath', 'criminal']; // user types

        this.users = this.Socket.data.users; // live users
        this.streamUrl = this.Socket.streamUrl; // strea url

        this.$scope.$watch(() => this.Socket.streamUrl, (url) => {
            this.$log.info('Stream URL: ' + url);
            this.streamUrl = this.Socket.streamUrl;
        });

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
