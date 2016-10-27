import io from 'socket.io-client';
import { ADDRESS, PORT } from '../../server/config';

export default class Socket {

    constructor($q, $log, $rootScope, $httpParamSerializer) {
        'ngInject';

        this.$q = $q;
        this.$log = $log;
        this.$rootScope = $rootScope;
        this.$httpParamSerializer = $httpParamSerializer;

        this.data = {
            isConnected: false,
            user: {},
            users: []
        };
    }

    connect(user) {
        this.socket = io(ADDRESS + ':' + PORT, {
            query: this.$httpParamSerializer(user)
        });
        this.data.user = user;
        this.data.isConnected = true;

        return this.bindSocketEvents();
    }

    bindSocketEvents() {
        this.socket.on('connect', this.onConnect.bind(this));
        this.socket.on('users:list', this.onUsersList.bind(this));
        this.socket.on('user:connect', this.onUserConnect.bind(this));
        this.socket.on('liveStream', this.onLiveStream.bind(this));
        this.socket.on('user:disconnect', this.ontUserDisconnect.bind(this));
    }

    onConnect(req) {
        this.$log.info('[INFO] You are now connected to Raspicam');
    }

    onUsersList(req) {
        for (let user of req.users) {
            this.data.users.push(user);
        }
        this.$rootScope.$apply();
    }

    onUserConnect(req) {
        this.data.users.push(req.user);
        this.$log.info('[INFO] New user connected: ' + req.user.name);
        this.$rootScope.$apply();
    }

    ontUserDisconnect(req) {
        if (angular.isDefined(req.user.id)) {
            this.$log.info('[INFO] User ' + req.user.name + ' left');
            for (let i = 0, ii = this.data.users.length; i < ii; i++) {
                if (this.data.users[i].id === req.user.id) {
                    this.data.users.splice(i, 1);
                }
            }
            this.$rootScope.$apply();
        }
    }

    onLiveStream(url) {
        this.streamUrl = url;
        this.$rootScope.$apply();
    }

    disconnect() {
        this.$log.info('[INFO] Disconnect...');
        this.socket.disconnect();
        this.data.isConnected = false;
    }
}
