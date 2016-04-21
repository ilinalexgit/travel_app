var travelApp =
    angular
        .module('travelApp', ['ui.router', 'oc.lazyLoad', 'infinite-scroll', 'travelApp.sort', 'xeditable', 'ui.bootstrap'])
            .factory('myHttpInterceptor', ['$q', '$location', '$window', '$injector', function($q, $location, $window, $injector) {

                return {
                    request: function(request) {
                        console.log('myHttpInterceptor - request');
                        return request;
                    },
                    requestError: function(requestError) {
                        console.log('myHttpInterceptor - requestError');
                        return requestError;
                    },
                    response: function(response) {
                        console.log('myHttpInterceptor - response');
                        return response;
                    },
                    responseError: function(responseError) {
                        console.log('myHttpInterceptor - responseError');
                        var AuthService = $injector.get('AuthService');
                        if (responseError.status == 401){
                            console.log('logout');
                            AuthService.logout();
                            $location.path('/login');
                        }
                        return $q.reject(responseError);
                    }
                };
            }])
            .config(['$locationProvider', '$httpProvider',
                function($locationProvider, $httpProvider) {
                    $locationProvider.html5Mode({
                        enabled:true,
                        requireBase:true
                    });
                    $httpProvider.interceptors.push('myHttpInterceptor');
            }])

            .run(['$rootScope', '$location', '$http', 'AuthService', 'UserService', '$ocLazyLoad', 'editableOptions',
                function($rootScope, $location, $http, AuthService, UserService, $ocLazyLoad, editableOptions){
                    console.log('run');
                    editableOptions.theme = 'bs3';
                    if (AuthService.isLogin()){
                        $http.defaults.headers.common.Authorization = 'Bearer ' + AuthService.isLogin();
                    }

                    $rootScope.$on('$locationChangeStart', function (event, next, current) {

                        if (!AuthService.isLogin() && $location.url() != '/signup' && $location.url() != '/password_recovery'){
                            console.log('need to login');
                            $location.path('/login');
                            console.log('12345');
                        }

                        console.log(next);
                        console.log(current);
                        if (AuthService.isLogin() && ($location.url() == '/signup' || $location.url() == '/login' || $location.url() == '/password_recovery')){
                            console.log('already logged in');
                            event.preventDefault();
                        }

                        if (AuthService.isLogin() && next == current && ($location.url() == '/signup' || $location.url() == '/login' || $location.url() == '/password_recovery')){
                            console.log('already logged in 2');
                            $location.path('/');
                        }

                    });
            }]);

angular.module('infinite-scroll').value('THROTTLE_MILLISECONDS', 500);