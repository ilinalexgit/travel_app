'use strict';

angular
    .module('travelApp')
    .controller('SignupController', ['$scope', '$location', '$rootScope', 'AuthService',
        function ( $scope, $location, $rootScope, AuthService) {

            $scope.error_messages = null;
            $scope.success_message = null;

            $scope.goToLogin = function(){
                $location.path('/login');
            };

            $scope.submit = function (credentials) {
                $scope.busy = true;
                $scope.error_messages = null;
                $scope.success_message = null;

                if($scope.form.$valid){
                    AuthService.signup(credentials, function(date){
                            $scope.success_message = 'Registration Successful! Please check your mailbox in 5 minutes to confirm your account.';
                            $scope.busy = null;
                        },
                        function(data){
                            $scope.error_messages = data.errors;
                            $scope.busy = null;
                        }
                    );
                }else{
                    $scope.busy = null;
                }
            };
        }
    ]);
