'use strict';

angular
    .module('travelApp')
    .controller('HomeController', ['$scope', '$location', '$rootScope', 'AuthService', 'loadTravels', 'TravelService', 'TravelListService', '$filter', 'CommonService', '$uibModal',
        function ($scope, $location, $rootScope, AuthService, loadTravels, TravelService, TravelListService, $filter, CommonService, $uibModal) {
            console.log('home controller');

            $scope.travel_list = new TravelListService();
            $scope.travel_list.addItems(loadTravels.data);
            $scope.common_service = new CommonService();

            $scope.order = 'start_dt_obj';
            $scope.reverse = true;

            $scope.username = localStorage.getItem("_travel_app_username");
            var today = new Date();
            $scope.today_month = $scope.common_service.getMonthSting(today.getMonth());
            $scope.today_year = today.getFullYear();

            $scope.searchStr = '';
            $scope.filters = {
                'date_filter_check': false,
                'date_filter_cond': '=',
                'start_dt_filter_check': false,
                'start_dt_filter_cond': '=',
                'end_dt_filter_check': false,
                'end_dt_filter_cond': '='
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

            var removeInserted = function (){
                if ($scope.inserted){
                    $scope.inserted = null;
                }
            };

            $scope.sortList = function (params){
                console.log(555);
                removeInserted();
                var sort_params = prepareRequestParams(params);
                return TravelService.getTravels(sort_params).then(function(data){
                    window.scrollTo(0, 0);
                    $scope.travel_list.removeItems();
                    $scope.travel_list.addItems(data.data);
                });

            };

            $scope.expand = function(item, showEl){
                $scope.common_service.expand(item, showEl, $scope);
            };

            $scope.openModal = function(item, showEl){
                console.log('open modal');
                var modalInstance = $uibModal.open({
                    animation: false,
                    templateUrl: 'templates/modal.html',
                    controller: 'ModalController'
                });

                modalInstance.result.then(function (selectedItem) {
                    console.log(selectedItem);

                    var date = new Date(selectedItem.year, selectedItem.month);
                    var params = {
                        'start_dt_filter_check': true,
                        'start_dt_filter_cond': 'between',
                        'start_dt_filter_value': $filter('date')(date, 'yyyy-MM-dd')
                    };
                    TravelService.getTravels(params).then(function(data){
                        console.log('dsssss');
                        console.log(data);
                        var printContents = '<style>' +
                            'table, th, td {' +
                            'border: 1px solid black;' +
                            'border-collapse: collapse;' +
                            '}' +
                            'th, td {' +
                            'padding: 15px;' +
                            '}' +
                            '</style><table>';
                        printContents += '<tr><td>Start Date</td><td>End Date</td><td>Destination</td><td>Notes</td></tr>';
                        for (var i=0; i<data.data.length; i++){
                            printContents += '<tr><td>'+data.data[i].start_dt.date.substr(0,data.data[i].start_dt.date.indexOf('.'))+'</td><td>'+data.data[i].end_dt.date.substr(0,data.data[i].end_dt.date.indexOf('.'))+'</td><td>'+data.data[i].destination+'</td><td>'+data.data[i].description+'</td></tr>';
                        }
                        printContents += '</table>';


                        var popupWin = window.open('', '_blank', 'width=600,height=600');
                        popupWin.document.open();
                        popupWin.document.write('<html><head><link rel="stylesheet" type="text/css" href="style.css" /></head><body onload="window.print()">' + printContents + '</body></html>');
                        popupWin.document.close();
                    });



                }, function () {
                    console.log('Modal dismissed at: ' + new Date());
                });
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
                $scope.common_service.cancel($event, $scope);
                /*if ($scope.inserted){
                    $scope.inserted = null;
                }else{
                    $scope.current_opened_el.$cancel();
                    $scope.current_opened = false;
                    $scope.current_opened_el = false;
                    $event.preventDefault();
                    $event.stopPropagation();
                }*/
            };

            $scope.remove = function(item){
                TravelService.deleteTravel(item.id).then(function (){
                    $scope.travel_list.removeItem(item);
                });
            };

            $scope.save = function(data, item, key){
                console.log(data);

                if ($scope.inserted){
                    console.log($scope.inserted);
                    var obj = {
                        'description': $scope.inserted.description,
                        'destination': $scope.inserted.destination,
                        'start_dt': {
                            'date': $scope.inserted.start_dt || 'error'
                        },
                        'end_dt': {
                            'date': $scope.inserted.end_dt || 'error'
                        }
                    };

                    return TravelService.createTravel(obj).then(function (data){
                        console.log($scope.inserted);
                        $scope.inserted.id = data.data.trip_id;
                        $scope.inserted.start_dt_obj = $scope.inserted.start_dt;
                        $scope.inserted.end_dt_obj = $scope.inserted.end_dt;

                        var diff = $scope.travel_list.getDiff($scope.inserted.start_dt_obj, $scope.inserted.end_dt_obj);
                        $scope.inserted.diff = diff.diffDays;
                        $scope.inserted.diff_str = diff.diffStr;

                        $scope.travel_list.items.push($scope.inserted);
                        $scope.travel_list.last++;
                        $scope.inserted = null;
                    });

                }else{

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

                    return TravelService.editTravel(obj, item.id).then(function (){
                        console.log("edited");

                        $scope.current_opened = false;
                        $scope.current_opened_el = false;

                        var diff = $scope.travel_list.getDiff(data.start_dt, data.end_dt);
                        item.diff = diff.diffDays;
                        item.diff_str = diff.diffStr;
                    });
                }
            };

            $scope.nextPage = function(){
                var params = prepareRequestParams();
                $scope.travel_list.nextPage(params);
            };

            $scope.addNewTrip = function(data){
                console.log(322);
                if (!$scope.inserted){
                    if ($scope.current_opened){
                        $scope.current_opened_el.$cancel();
                        $scope.current_opened = false;
                        $scope.current_opened_el = false;
                    }


                    $scope.inserted = {
                        description: '',
                        destination: null,
                        start_dt: '',
                        end_dt: ''
                    };
                }
            };

            $scope.search = function(){
                var params = prepareRequestParams();
                TravelService.getTravels(params).then(function(data){
                    window.scrollTo(0, 0);
                    $scope.travel_list.removeItems();
                    $scope.travel_list.addItems(data.data);
                });
            };

            $scope.filter_date = new Date();
            $scope.filter_start_dt = new Date();
            $scope.filter_end_dt = new Date();

            $scope.formats = ['dd MMMM yyyy', 'yyyy/MM/dd', 'dd.MM.yyyy', 'shortDate'];
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
            };

            $scope.new_start_dt_popup = {
                opened: false
            };

            $scope.new_start_dt_popup_open = function() {
                $scope.new_start_dt_popup.opened = true;
            };

            $scope.new_end_dt_popup = {
                opened: false
            };

            $scope.new_end_dt_popup_open = function() {
                $scope.new_end_dt_popup.opened = true;
            };




            $scope.applyFilters = function(){
                console.log(3222);
                var params = prepareRequestParams();
                TravelService.getTravels($scope.filters).then(function(data){
                    window.scrollTo(0, 0);
                    $scope.travel_list.removeItems();
                    $scope.travel_list.addItems(data.data);
                });
            };

            var prepareRequestParams = function(params){
                var res = {};
                //filters
                var date_filter_str = $filter('date')($scope.filter_date, 'yyyy-MM-dd');
                var start_dt_filter_str = $filter('date')($scope.filter_start_dt, 'yyyy-MM-dd');
                var end_dt_filter_str = $filter('date')($scope.filter_end_dt, 'yyyy-MM-dd');

                $scope.filters.date_filter_value = date_filter_str;
                $scope.filters.start_dt_filter_value = start_dt_filter_str;
                $scope.filters.end_dt_filter_value = end_dt_filter_str;


                var filters_obj = angular.copy($scope.filters);

                //sort
                var sort_params = {};
                if (params){
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
                }

                //search
                var search_obj = {};
                if ($scope.searchStr.length > 1){
                    search_obj.search = $scope.searchStr;
                }

                res = angular.extend(filters_obj, sort_params);
                res = angular.extend(res, search_obj);
                return res;
            }
        }
    ]);