import './assets/sass/main';
import 'angular-material/angular-material.scss';

import angular from 'angular';

import 'angular-socket-io';
import 'angular-material';
import 'angular-sanitize';
import 'videogular';

import Socket from './services/socket';
import mainController from './controllers/main';

export default angular.module('Raspicam', [
        'btford.socket-io',
        'ngMaterial',
        'com.2fdevs.videogular',
        'ngSanitize'
    ])
    .service('Socket', Socket)
    .controller('mainController', mainController);
