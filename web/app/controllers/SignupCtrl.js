'use strict';

angular
    .module('travelApp')
    .controller('SignupController', ['$scope', '$location', '$rootScope', 'AuthService',
        function ( $scope, $location, $rootScope, AuthService) {
            console.log('signup controller');

            $scope.error_messages = null;
            $scope.success_message = null;

            $scope.submit = function (credentials) {
                $scope.error_messages = null;
                $scope.success_message = null;

                if($scope.form.$valid){
                    AuthService.signup(credentials, function(date){
                            $scope.success_message = 'Success';
                        },
                        function(data){
                            $scope.error_messages = data.errors;
                        }
                    );
                }
            };
        }
    ]);
