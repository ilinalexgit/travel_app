'use strict';

angular
    .module('travelApp')
    .factory('UserListService', ['$rootScope', 'UserService', 'AuthService',
        function ($rootScope, UserService, AuthService) {
            var UserList = function() {
                this.items = [];
                this.busy = false;
                this.last = 0;
                this.count = 20;
            };

            UserList.prototype.nextPage = function(params) {
                console.log(88888);
                if (this.busy) return;
                this.busy = true;

                params.start = this.last;
                params.length = this.count;

                UserService.getUsers(params).then(function(data) {
                    var items = data.data;
                    this.addItems(items);
                    this.busy = false;
                }.bind(this));
            };

            UserList.prototype.addItems = function(items) {
                for (var i = 0; i < items.length; i++) {
                    if (items[i].roles.indexOf('ROLE_ADMIN') != -1){
                        items[i].is_admin = true;
                    }else{
                        items[i].is_admin = false;
                    }
                    this.items.push(items[i]);
                }
                this.last = this.last + items.length;
            };

            UserList.prototype.removeItems = function() {
                this.items = [];
                this.last = 0;
            };

            UserList.prototype.removeItem = function(item) {
                var key = this.items.indexOf(item);
                this.items.splice(key, 1);
            };

            return UserList;
        }
    ]);