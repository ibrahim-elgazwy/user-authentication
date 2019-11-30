(function () {
    'use strict';

    angular
        .module('app')
        .controller('LoginController', LoginController);

    function LoginController($location, $state, AuthenticationService) {
        
        var vm = this;
        vm.user = {
            email: null,
            password:null
        }
        vm.usernameIsrequired = false;
        vm.userNotExist = false;

        vm.login = login;

        // reset login status
        function initController() {
            AuthenticationService.Logout();
        };

        initController();

        function login() {
            debugger
            if(vm.user && !vm.user.email){
                vm.usernameIsrequired = true;
                return;
            }
            
            if(vm.user && !vm.user.password){
                vm.passwordIsrequired = true;
                return;
            }

            vm.loading = true;
            AuthenticationService.Login(vm.user, function (result) {
                debugger
                if (result === true) {
                    $location.path('/home');
                } else {
                    vm.error = 'Username or password is incorrect';
                    vm.userNotExist = true;
                }
            });
        };
    }

})();