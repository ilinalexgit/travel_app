'use strict';

angular
    .module('travelApp')
    .controller('LoginController', ['$scope', '$location', '$rootScope', 'AuthService',
        function ($scope, $location, $rootScope, AuthService) {
            console.log('login controller');

            $scope.error_message = null;

            $scope.goToForgotPwd = function(){
                $location.path('/password_recovery');
            };

            $scope.submit = function (credentials) {
                $scope.error_message = null;

                console.log($scope.form.$valid);
                if($scope.form.$valid){
                    AuthService.login(credentials, function(data){
                            console.log(999);
                            console.log(data.user.username);
                            var is_admin = AuthService.isAdmin(data.user.roles);
                            if (is_admin){
                                $location.path('/admin');
                            }else{
                                $location.path('/');
                            }
                        },
                        function(data){
                            if (data.message){
                                $scope.error_message = data.message;
                            }else{
                                $scope.error_message = 'Server error.';
                            }

                        }
                    );
                }
            };
        }
    ]);