'use strict';

angular
    .module('travelApp')
    .controller('HomeController', ['$scope', '$location', '$rootScope', 'AuthService', 'loadTravels', 'TravelService', 'TravelListService', '$filter', 'CommonService', '$uibModal',
        function ($scope, $location, $rootScope, AuthService, loadTravels, TravelService, TravelListService, $filter, CommonService, $uibModal) {

            $scope.travel_list = new TravelListService();
            $scope.travel_list.addItems(loadTravels.data);
            $scope.common_service = new CommonService();

            console.log($scope.travel_list);

            $scope.order = 'start_dt_obj';
            $scope.reverse = true;

            $scope.username = localStorage.getItem("_travel_app_username");
            var today = new Date();
            var next_month = today.getMonth()+1;
            var year = today.getFullYear();
            if (next_month == 12){
                next_month = 0;
                year++;
            }

            $scope.today_month = $scope.common_service.getMonthSting(next_month);
            $scope.today_year = year;

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
                var modalInstance = $uibModal.open({
                    animation: false,
                    templateUrl: 'templates/modal.html',
                    controller: 'ModalController'
                });

                modalInstance.result.then(function (selectedItem) {

                    var date = new Date(selectedItem.year, selectedItem.month);
                    var params = {
                        'start_dt_filter_check': true,
                        'start_dt_filter_cond': 'between',
                        'start_dt_filter_value': $filter('date')(date, 'yyyy-MM-dd')
                    };
                    TravelService.getTravels(params).then(function(data){
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
                $scope.opened1[elementOpened] = !$scope.opened1[elementOpened];

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

            $scope.checkDestination = function(data){
                if ( !data.destination || data.destination.trim() == ''){
                    return 'Can not be empty.';
                }
            };

            $scope.checkStartDate = function(data){
                if ( !data.start_dt){
                    return 'Invalid date.';
                }
            };

            $scope.checkEndDate = function(data){
                if ( !data.end_dt ){
                    return 'Invalid date.';
                }else if (data.start_dt && data.start_dt > data.end_dt){
                    return 'End date can not be > start date.';
                }
            };

            $scope.save = function(data, item, key){

                if ($scope.inserted){
                    var obj = {
                        'description': data.description,
                        'destination': data.destination,
                        'start_dt': {
                            'date': $scope.common_service.dateFormat(data.start_dt) || 'error'
                        },
                        'end_dt': {
                            'date': $scope.common_service.dateFormat(data.end_dt) || 'error'
                        }
                    };
                    console.log(obj);
                    return TravelService.createTravel(obj).then(function (data_res){
                        obj.id = data_res.data.trip_id;
                        obj.start_dt_obj = data.start_dt;
                        obj.end_dt_obj = data.end_dt;
                        var now = new Date();

                        var diff = $scope.travel_list.getDiff(now, obj.start_dt_obj);
                        obj.diff = diff.diffDays;
                        obj.diff_str = diff.diffStr;

                        $scope.travel_list.items.push(obj);
                        $scope.travel_list.last++;
                        $scope.inserted = undefined;
                        $scope.inserted.description = '';
                    });

                }else{

                    var obj = {
                        'description': data.description,
                        'destination': data.destination,
                        'start_dt': {
                            'date': $scope.common_service.dateFormat(data.start_dt) || 'error'
                        },
                        'end_dt': {
                            'date': $scope.common_service.dateFormat(data.end_dt) || 'error'
                        }
                    };

                    return TravelService.editTravel(obj, item.id).then(function (){

                        $scope.current_opened = false;
                        $scope.current_opened_el = false;
                        var now = new Date();

                        var diff = $scope.travel_list.getDiff(now, data.start_dt);
                        item.diff = diff.diffDays;
                        item.diff_str = diff.diffStr;
                    });
                }
            };

            $scope.nextPage = function(){
                var params = prepareRequestParams();
                $scope.travel_list.nextPage(params);
            };

            $scope.addNewTrip = function(showEl){
                if (!$scope.inserted){
                    showEl.$show();
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