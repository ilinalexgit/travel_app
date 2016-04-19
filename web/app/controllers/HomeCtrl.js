'use strict';

angular
    .module('travelApp')
    .controller('HomeController', ['$scope', '$location', '$rootScope', 'AuthService', 'loadTravels', 'TravelService', 'TravelListService',
        function ($scope, $location, $rootScope, AuthService, loadTravels, TravelService, TravelListService) {
            console.log('home controller');

            //var current_opened_id = false;
            //var current_opened_el = false;

            $scope.travel_list = new TravelListService();
            $scope.travel_list.addItems(loadTravels.data);

            $scope.order = 'start_dt_obj';
            $scope.reverse = true;

            $scope.searchStr = '';
            $scope.filters = {
                'date_filter':{
                    'check': false,
                    'cond': false,
                    'value': false
                },
                'start_dt_filter':{
                    'check': false,
                    'cond': false,
                    'value': false
                },
                'end_dt_filter':{
                    'check': false,
                    'cond': false,
                    'value': false
                }
            };


            $scope.travels = [];
            console.log(loadTravels.data);
            console.log($scope.travel_list);

            $scope.logout = function (credentials) {
                $scope.error_message = null;
                AuthService.logout();
                $location.path('/login');
            };

            $scope.test = function (credentials) {
                $location.path('/login');
            };

            $scope.test2= function (credentials) {
                $location.path('/admin');
            };

            $scope.sortList = function (params){
                console.log(555);
                var sort_params = {};
                if (params.reverse){
                    sort_params.order_dir = 'DESC';
                }else{
                    sort_params.order_dir = 'ASC';
                }
                switch (params.order){
                    case 'start_dt_obj':
                        sort_params.order_field = 'start_dt';
                        break;
                    case 'end_dt_obj':
                        sort_params.order_field = 'end_dt';
                        break;
                    default:
                        sort_params.order_field = params.order;
                        break;
                }

                return TravelService.getTravels(sort_params).then(function(data){
                    console.log(888);
                    window.scrollTo(0, 0);
                    $scope.travel_list.removeItems();
                    $scope.travel_list.addItems(data.data);
                });

            };

            $scope.expand = function(item, showEl){
                console.log('expand');
                //console.log(current_opened_id);
                console.log(item.id);
                if ($scope.inserted){
                    $scope.travel_list.items.splice(0,1);
                    $scope.inserted = null;
                }
                if ($scope.current_opened_el && $scope.current_opened_id != item.id){
                    $scope.current_opened_el.$cancel();
                    showEl.$show();
                }else if($scope.current_opened_id != item.id){
                    showEl.$show();
                }

                $scope.current_opened_id = item.id;
                $scope.current_opened_el = showEl;
            };

            $scope.user = {
                name: 'awesome user'
            };

            $scope.opened1 = {};
            $scope.opened2 = {};

            $scope.open1 = function($event, elementOpened) {
                $event.preventDefault();
                $event.stopPropagation();
                console.log(elementOpened);
                $scope.opened1[elementOpened] = !$scope.opened1[elementOpened];
                console.log($scope.opened1[elementOpened]);

                if ($scope.opened1[elementOpened]){
                    $scope.opened2[elementOpened] = false;
                }

            };

            $scope.open2 = function($event, elementOpened) {
                $event.preventDefault();
                $event.stopPropagation();

                $scope.opened2[elementOpened] = !$scope.opened2[elementOpened];

                if ($scope.opened2[elementOpened]){
                    $scope.opened1[elementOpened] = false;
                }
            };

            $scope.cancel = function($event){
                if ($scope.inserted){
                    $scope.travel_list.items.splice(0,1);
                    $scope.inserted = null;
                }else{
                    $scope.current_opened_el.$cancel();
                    $scope.current_opened_id = false;
                    $scope.current_opened_el = false;
                    $event.preventDefault();
                    $event.stopPropagation();
                }
            };

            $scope.remove = function(item){
                TravelService.deleteTravel(item.id).then(function (){
                    $scope.travel_list.removeItem(item);
                });
            };

            $scope.save = function(data, item, key){
                console.log(data);
                var obj = {
                    'description': data.description,
                    'destination': data.destination,
                    'start_dt': {
                        'date': data.start_dt || 'error'
                    },
                    'end_dt': {
                        'date': data.end_dt || 'error'
                    }
                };
                if ($scope.inserted){
                    return TravelService.createTravel(obj).then(function (){
                        $scope.travel_list.last++;
                    });

                }else{

                    return TravelService.editTravel(obj, item.id).then(function (){
                        console.log("edited");
                        $scope.current_opened_id = false;
                        $scope.current_opened_el = false;
                    });
                }
            };

            $scope.addNewTrip = function(){
                if ($scope.current_opened_id){
                    $scope.current_opened_el.$cancel();
                    $scope.current_opened_id = false;
                    $scope.current_opened_el = false;
                }


                $scope.inserted = {
                    description: '',
                    destination: null,
                    start_dt: '',
                    end_dt: ''
                };

                $scope.travel_list.items.unshift($scope.inserted);
            };

            $scope.search = function(){
                var search_obj = {};
                if ($scope.searchStr.length > 1){
                    search_obj.search = $scope.searchStr;
                }
                TravelService.getTravels(search_obj).then(function(data){
                    window.scrollTo(0, 0);
                    $scope.travel_list.removeItems();
                    $scope.travel_list.addItems(data.data);
                });
            };

            $scope.filter_date = new Date();
            $scope.filter_start_dt = new Date();
            $scope.filter_end_dt = new Date();

            $scope.formats = ['dd-MMMM-yyyy', 'yyyy/MM/dd', 'dd.MM.yyyy', 'shortDate'];
            $scope.format = $scope.formats[0];

            $scope.dateOptions = {
                formatYear: 'yy',
                startingDay: 1
            };

            $scope.filter_date_popup = {
                opened: false
            };

            $scope.filter_date_popup_open = function() {
                $scope.filter_date_popup.opened = true;
            };

            $scope.filter_start_dt_popup = {
                opened: false
            };

            $scope.filter_start_dt_popup_open = function() {
                $scope.filter_start_dt_popup.opened = true;
            };

            $scope.filter_end_dt_popup = {
                opened: false
            };

            $scope.filter_end_dt_popup_open = function() {
                $scope.filter_end_dt_popup.opened = true;
            }

            $scope.applyFilters = function(){
                console.log(3222);
            }
        }
    ]);