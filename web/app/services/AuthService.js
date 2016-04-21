'use strict';

angular
    .module('travelApp')
    .factory('AuthService', ['$rootScope', '$http', '$httpParamSerializerJQLike',
        function ($rootScope, $http, $httpParamSerializerJQLike) {
            return {
                signup: function(credentials, handleSuccess, handleError){
                    return $http({
                        url: '/api/register',
                        method: "POST",
                        data: $httpParamSerializerJQLike(credentials),
                        headers: {'Content-Type': 'application/x-www-form-urlencoded'}
                    }).success(function (data, status, headers, config) {
                        handleSuccess(data);

                    }).error(function (data, status, headers, config) {
                        handleError(data);
                    });
                },
                login:function (credentials, handleSuccess, handleError) {
                    return $http({
                        url: '/api/login_check',
                        method: "POST",
                        data: $httpParamSerializerJQLike(credentials),
                        headers: {'Content-Type': 'application/x-www-form-urlencoded'}
                    }).success(function (data, status, headers, config) {
                        if (data.token){
                            localStorage.setItem("_travel_app_token", data.token);
                            localStorage.setItem("_travel_app_username", data.user.username);
                            $http.defaults.headers.common.Authorization = 'Bearer ' + data.token;
                            handleSuccess(data);
                        }else{
                            handleError(data);
                        }
                    }).error(function (data, status, headers, config) {
                        handleError(data);
                    });
                },
                password_recovery:function(credentials, handleSuccess, handleError){
                    return $http({
                        url: '/api/password_recovery',
                        method: "POST",
                        data: $httpParamSerializerJQLike(credentials),
                        headers: {'Content-Type': 'application/x-www-form-urlencoded'}
                    }).success(function (data, status, headers, config) {
                        handleSuccess(data);
                    }).error(function (data, status, headers, config) {
                        handleError(data);
                    });
                },
                logout:function() {
                    delete $http.defaults.headers.common.Authorization;
                    localStorage.setItem("_travel_app_token", '');
                    localStorage.setItem("_travel_app_username", '');
                },
                isLogin:function(){
                    var token = localStorage.getItem("_travel_app_token");
                    if (token){
                        return token;
                    }else{
                        return false;
                    }
                },
                isAdmin:function(roles){
                    var is_admin = false;
                    for(var i=0; i<roles.length; i++){
                        if(roles[i] == 'ROLE_ADMIN'){
                            is_admin = true;
                        }
                    }
                    return is_admin;
                }
            };
        }
    ]);
