'use strict';

angular
    .module('travelApp')
    .controller('PasswordRecoveryController', ['$scope', '$location', '$rootScope', 'AuthService',
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
                    AuthService.password_recovery(credentials, function(date){
                            $scope.success_message = 'Success';
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
