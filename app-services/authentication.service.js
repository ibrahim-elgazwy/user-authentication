(function () {
    'use strict';
    angular
        .module('app')
        .factory('AuthenticationService', Service);

    function Service($http, $localStorage) {
        
        var service = {};

        service.Login = Login;
        service.Logout = Logout;

        function Login(user, callback) {
            //2 day expiry time 
            var exp = 2 * 24 * 60 *60;
            var data = new FormData();
            data.append("user[email]", user.email);
            data.append("user[password]", user.password);
            data.append("exp", exp);
        

            var authUrl = 'http://178.62.62.73:80//api/v1/user/sessions.json';

            var config = {
                headers : {
                    'X-APP-Token': 'Playground',
                    "Content-type" : undefined
                }
            }

            $http.post(authUrl, data, config)
                .then(function (response) {
                    // login successful if there's a token in the response
                    if (response && response.data) {
                        var token = response.data.token;
                        var username = response.data.user.first_name + ' ' + response.data.user.last_name;
                        // store username and token in local storage to keep user logged in between page refreshes
                        $localStorage.currentUser = { username: username, token: token };

                        // add jwt token to auth header for all requests made by the $http service
                        $http.defaults.headers.common.Authorization = 'Bearer ' + token;

                        // execute callback with true to indicate successful login
                        callback(true);
                    } else {
                        // execute callback with false to indicate failed login
                        callback(false);
                    }
                }, function (err){
                    callback(false);
                });
        }

        function Logout() {
            // remove user from local storage and clear http auth header
            delete $localStorage.currentUser;
            $http.defaults.headers.common.Authorization = '';
        }

        return service;
    }
})();