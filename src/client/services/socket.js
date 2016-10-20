import io from 'socket.io-client';
import { ADDRESS, PORT } from '../../server/config';

export default class Socket {
    constructor($q, $log) {
        'ngInject';
        this.$q = $q;
        this.$log = $log;
        this.isConnected = false;
        this.connect().then(() => {
            this.onConnect();
        });
    }

    connect(name = 'User_' + Date.now()) {
        const defer = this.$q.defer();
        try {
            this.socket = io(ADDRESS + ':' + PORT, { 
                query: `name=${name}`
            });
            defer.resolve(this.isConnected = true);
        } catch(error) {
            defer.reject(error);
        }

        return defer.promise;
    }

    onConnect() {
        this.socket.on('connect', () => {
            this.$log.info('[INFO] You are now connected to Raspicam');
        });
    }
}