'use strict';

angular
    .module('travelApp')
    .controller('HomeController', ['$scope', '$location', '$rootScope', 'AuthService', 'loadTravels', 'TravelService',
        function ($scope, $location, $rootScope, AuthService, loadTravels, TravelService) {
            console.log('home controller');

            $scope.travels = [];
            console.log(loadTravels.data);

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