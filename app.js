(function () {
    'use strict';

    angular
        .module('app', ['ui.router', 'ngMessages', 'ngStorage', 'swangular'])
        .config(config)
        .run(run);
        
    function config($stateProvider, $urlRouterProvider) {
        debugger
        // default route
        
        $urlRouterProvider.otherwise("/login");

        // app routes
        $stateProvider
            .state('home', {
                url: '/home',
                templateUrl: './home/home-view.html',
                controller: 'HomeController',
                controllerAs: 'ctrl'
            })
            .state('login', {
                url: '/login',
                templateUrl: 'login/login-view.html',
                controller: 'LoginController',
                controllerAs: 'ctrl'
            });
    }

    function run($rootScope, $http, $location, $localStorage) {
        // keep user logged in after page refresh
        if ($localStorage.currentUser) {
            $http.defaults.headers.common.Authorization = 'Bearer ' + $localStorage.currentUser.token;
        } else {
            $http.defaults.headers.common.Authorization = 'Bearer ' + 'Playground';
        }

        // redirect to login page if not logged in and trying to access a restricted page
        $rootScope.$on('$locationChangeStart', function (event, next, current) {
            var publicPages = ['/login'];
            var restrictedPage = publicPages.indexOf($location.path()) === -1;
            if (restrictedPage && !$localStorage.currentUser) {
                $location.path('/login');
            }
        });
    }
})();