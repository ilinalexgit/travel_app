'use strict';

angular
    .module('travelApp')
    .controller('LoginController', ['$location', '$rootScope',
        function ($location, $rootScope) {
            console.log('login controller');
        }
    ]);