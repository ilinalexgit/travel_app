'use strict';

angular
    .module('travelApp')
    .controller('AdminController', ['$scope', '$location', '$rootScope', 'AuthService', 'UserService', 'loadUsers', 'UserListService', 'CommonService',
        function ($scope, $location, $rootScope, AuthService, UserService, loadUsers, UserListService, CommonService) {
            console.log('admin controller');

            $scope.common_service = new CommonService();
            $scope.user_list = new UserListService();
            $scope.user_list.addItems(loadUsers.data);

            $scope.order = 'username';
            $scope.reverse = true;
            $scope.searchStr = '';

            $scope.username = localStorage.getItem("_travel_app_username");

            $scope.logout = function (credentials) {
                $scope.error_message = null;
                AuthService.logout();
                $location.path('/login');
            };

            $scope.test = function (credentials) {
                $location.path('/home');
            };

            $scope.nextPage = function(){
                var params = prepareRequestParams(params);
                $scope.user_list.nextPage(params);
            };

            //////////////////////////////////

            $scope.expand = function(item, showEl){
                $scope.common_service.expand(item, showEl, $scope);
                /*console.log('expand');
                console.log(showEl);
                if ($scope.inserted){
                    $scope.inserted = null;
                }
                if ($scope.current_opened_el && $scope.current_opened != item){
                    $scope.current_opened_el.$cancel();
                    showEl.$show();
                }else if($scope.current_opened != item){
                    showEl.$show();
                }

                $scope.current_opened = item;
                $scope.current_opened_el = showEl;*/
            };

            $scope.checkUsername = function(data){
                if ( !data.username || data.username.trim() == ''){
                    return 'Can not be empty.';
                }
            };

            $scope.checkEmail = function(data){
                if ( !data.email || data.email.trim() == ''){
                    return 'Invalid email.';
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

            var removeInserted = function (){
                if ($scope.inserted){
                    $scope.inserted = null;
                }
            };

            ////////////////////////////////

            $scope.sortList = function (params){
                console.log(555);
                removeInserted();
                var sort_params = prepareRequestParams(params);
                return UserService.getUsers(sort_params).then(function(data){
                    console.log(data.data);
                    window.scrollTo(0, 0);
                    $scope.user_list.removeItems();
                    $scope.user_list.addItems(data.data);
                });

            };

            $scope.remove = function(item){
                UserService.deleteUser(item.id).then(function (){
                    $scope.user_list.removeItem(item);
                });
            };

            $scope.save = function(data, item, key){
                if ($scope.inserted){
                    console.log($scope.inserted);
                    var obj = {
                        'username': data.username,
                        'password': data.plainPassword,
                        'email': data.email,
                        'is_admin': data.is_admin
                    };

                    return UserService.createUser(obj).then(function (data){
                        console.log($scope.inserted);
                        obj.id = data.data.user_id;
                        $scope.user_list.items.push(obj);
                        $scope.user_list.last++;
                        $scope.inserted = null;
                        $scope.inserted.id = '';
                    });

                }else{
                    console.log(data);
                    var obj = {
                        'username': data.username,
                        'password': data.plainPassword,
                        'email': data.email,
                        'is_admin': data.is_admin
                    };

                    return UserService.editUser(obj, item.id).then(function (){
                        console.log("edited");
                        $scope.current_opened = false;
                        $scope.current_opened_el = false;
                    });
                }
            };

            $scope.search = function(){
                var params = prepareRequestParams();
                UserService.getUsers(params).then(function(data){
                    window.scrollTo(0, 0);
                    $scope.user_list.removeItems();
                    $scope.user_list.addItems(data.data);
                });
            };

            $scope.addNewUser = function(data){
                if (!$scope.inserted){
                    data.$show();
                    if ($scope.current_opened){
                        $scope.current_opened_el.$cancel();
                        $scope.current_opened = false;
                        $scope.current_opened_el = false;
                    }

                    $scope.inserted = {
                        username: '',
                        email: null,
                        password: '',
                        is_admin: ''
                    };
                }
            };

            $scope.checkPassword = function(data){
                if ( !data.plainPassword || data.plainPassword.trim() == ''){
                    return 'Can not be empty.';
                }
            };


            var prepareRequestParams = function(params){
                var res = {};
                //sort
                var sort_params = {};
                if (params){
                    if (params.reverse){
                        sort_params.order_dir = 'DESC';
                    }else{
                        sort_params.order_dir = 'ASC';
                    }
                    sort_params.order_field = params.order;
                }

                //search
                var search_obj = {};
                if ($scope.searchStr.length > 1){
                    search_obj.search = $scope.searchStr;
                }

                res = angular.extend(search_obj, sort_params);
                return res;
            };
        }
    ]);