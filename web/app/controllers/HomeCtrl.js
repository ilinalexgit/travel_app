'use strict';

angular
    .module('travelApp')
    .controller('HomeController', ['$scope', '$location', '$rootScope', 'AuthService',
        function ($scope, $location, $rootScope, AuthService) {
            console.log('home controller');


            $scope.logout = function (credentials) {
                $scope.error_message = null;
                AuthService.logout();
                $location.path('/login');
            };

            $scope.test = function (credentials) {
                $location.path('/login');
            };

            $scope.test2= function (credentials) {
                $location.path('/admin');
            };
        }
    ]);