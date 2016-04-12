var travelApp =
    angular
        .module('travelApp', ['ui.router', 'oc.lazyLoad'])
            .config(['$locationProvider',
                function($locationProvider) {
                    $locationProvider.html5Mode({
                        enabled:true,
                        requireBase:true
                    });
            }])

            .run(['$rootScope', '$location', '$http',
                function($rootScope, $location, $http){
                    console.log('run');
            }]);