import angular from 'angular';

import Socket from './services/socket';
import mainController from './controllers/main';

export default angular.module('Raspicam', [])
    .service('Socket', Socket)
    .controller('mainController', mainController);