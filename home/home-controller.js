(function () {
    'use strict';

    angular
        .module('app')
        .controller('HomeController', HomeController);

    function HomeController($http, $localStorage, swangular) {

        var vm = this;
        vm.currentPage = 1;
        vm.showCurrentPage = false;

        // filter by type list
        vm.filterTypes = [
            {id : 0, type : 'open'},
            {id : 1, type : 'official'},
            {id : 2, type : 'all'},
        ];
        //select default type
        vm.filterType = vm.filterTypes[0];
        //get username and token
        vm.userName = $localStorage.currentUser.username;
        var token = $localStorage.currentUser.token;
        //base url services
        var baseUrl = 'http://178.62.62.73:80//api/v1/user';
        //http config paramter
        var config = {
            headers : {
                'X-APP-Token': 'Playground',
                "X-User-Token" : token
            }
        }
        //get rides 
        vm.getAllRides = getAllRides;
        //subscribe ride
        vm.subscribe = subscribe;
        //get next rides page
        vm.getNextRides = getNextRides;
        //get prevouse rides page
        vm.getPrevouseRides = getPrevouseRides;
        //get by specific page
        vm.getRidesbyTopPages = getRidesbyTopPages;


        function subscribe(id){
            var subscribeUrl = baseUrl + '/rides/' + id + '/subscribe.json';
            $http.post(subscribeUrl, null, config).then(function(result){
                swangular.swal("Thanks!", result.data.message, "success")
            }, function(err){
                swangular.swal("Soory!", err.data.message, "error")
            });
        }

        function getAllRides() {
            vm.showRides = false;
            vm.noRides = false;

            var allRidesUrl = baseUrl + '/rides.json?' + 'filter=' + vm.filterType.type + '&page=' + vm.currentPage;
            
            $http.get(allRidesUrl, config)
                .then(function (response) {
                    // get all rides
                    if (response && response.data && response.data.length) {
                        vm.allRides = response.data;
                        vm.showRides = true;
                    } else {
                        // there is no rides avaliable
                        vm.noRides = true; 
                    }
                }, function (err){
                    callback(false);
                });
        }

        //get next ride page
        function getNextRides(){
            vm.currentPage +=1;

            if(vm.currentPage > 3)
                vm.showCurrentPage = true;
           
            vm.getAllRides();
        }

        //get prevouse ride page
        function getPrevouseRides(){
            if(vm.currentPage > 1)
                vm.currentPage -=1;
            else
                vm.currentPage = 1;
            
             if(vm.currentPage < 4)
                 vm.showCurrentPage = false;
            
            vm.getAllRides();
            
        }

        //get by top 3 pages
        function getRidesbyTopPages(page){
            vm.currentPage = page;
            vm.getAllRides();
        }

        //load first page when loading home page
        vm.getAllRides();
    }

})();