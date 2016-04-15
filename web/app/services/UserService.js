'use strict';

angular
    .module('travelApp')
    .factory('UserService', ['$rootScope', '$http', '$httpParamSerializerJQLike',
        function ($rootScope, $http, $httpParamSerializerJQLike) {
            return {
                getUserInfo: function(){
                    return $http({
                        url: '/api/user',
                        method: "GET"
                    });
                }
            };
        }
    ]);
