var travelApp =
    angular
        .module('travelApp', ['ui.router', 'oc.lazyLoad', 'infinite-scroll', 'travelApp.sort', 'xeditable', 'ui.bootstrap'])
            .factory('myHttpInterceptor', ['$q', '$location', '$window', '$injector', function($q, $location, $window, $injector) {

                return {
                    request: function(request) {
                        return request;
                    },
                    requestError: function(requestError) {
                        return requestError;
                    },
                    response: function(response) {
                        return response;
                    },
                    responseError: function(responseError) {
                        var AuthService = $injector.get('AuthService');
                        if (responseError.status == 401){
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
                    editableOptions.theme = 'bs3';
                    if (AuthService.isLogin()){
                        $http.defaults.headers.common.Authorization = 'Bearer ' + AuthService.isLogin();
                    }

                    $rootScope.$on('$locationChangeStart', function (event, next, current) {

                        if (!AuthService.isLogin() && $location.url() != '/signup' && $location.url() != '/password_recovery'){
                            $location.path('/login');
                        }

                        if (AuthService.isLogin() && ($location.url() == '/signup' || $location.url() == '/login' || $location.url() == '/password_recovery')){
                            event.preventDefault();
                        }

                        if (AuthService.isLogin() && next == current && ($location.url() == '/signup' || $location.url() == '/login' || $location.url() == '/password_recovery')){
                            $location.path('/');
                        }

                    });
            }]);

angular.module('infinite-scroll').value('THROTTLE_MILLISECONDS', 500);