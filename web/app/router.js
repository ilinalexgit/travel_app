angular
    .module('travelApp')
    .config(['$stateProvider', '$urlRouterProvider',
    function ($stateProvider, $urlRouterProvider) {
        $urlRouterProvider.otherwise("/");
        $stateProvider
            .state('home', {
                url: "/",
                templateUrl: "templates/home.html"
            })
            .state('login', {
                url: "/login",
                resolve: {
                    loadLoginCtrl: ['$ocLazyLoad', function($ocLazyLoad) {
                        return $ocLazyLoad.load('controllers/LoginCtrl.js');
                    }]
                },
                templateUrl: "templates/login.html",
                controller: "LoginController"
            })
            .state('signup', {
                url: "/signup",
                templateUrl: "templates/signup.html",
                controller: "SignupController"
            })
    }
]);