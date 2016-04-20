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
                },
                getUsers: function(params){
                    return $http({
                        url: '/api/users',
                        method: "GET",
                        params: (params)
                    });
                },
                deleteUser: function(id){
                    return $http({
                        url: '/api/users/'+id,
                        method: "DELETE"
                    });
                },
                editUser: function(item, id){
                    return $http({
                        url: '/api/users/'+id,
                        method: "PUT",
                        data: $httpParamSerializerJQLike(item),
                        headers: {'Content-Type': 'application/x-www-form-urlencoded'}
                    });
                },
                createUser: function(item){
                    return $http({
                        url: '/api/users',
                        method: "POST",
                        data: $httpParamSerializerJQLike(item),
                        headers: {'Content-Type': 'application/x-www-form-urlencoded'}
                    });
                },
            };
        }
    ]);
