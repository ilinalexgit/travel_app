'use strict';

angular
    .module('travelApp')
    .controller('AdminController', ['$scope', '$location', '$rootScope', 'AuthService', 'UserService',
        function ($scope, $location, $rootScope, AuthService, UserService) {
            console.log('admin controller');


            $scope.logout = function (credentials) {
                $scope.error_message = null;
                AuthService.logout();
                $location.path('/login');
            };

            $scope.test = function (credentials) {
                UserService.getUserInfo().then(function successCallback(response) {
                    // this callback will be called asynchronously
                    // when the response is available
                    console.log('success');
                }, function errorCallback(response) {
                    console.log('error');
                    // called asynchronously if an error occurs
                    // or server returns response with an error status.
                });
            };
        }
    ]);