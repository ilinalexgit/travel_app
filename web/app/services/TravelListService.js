'use strict';

angular
    .module('travelApp')
    .factory('TravelListService', ['$rootScope', 'TravelService',
        function ($rootScope, TravelService) {
            var TravelList = function() {
                this.items = [];
                this.busy = false;
                this.last = 0;
                this.count = 20;
            };

            TravelList.prototype.nextPage = function() {
                console.log(88888);
                if (this.busy) return;
                this.busy = true;

                var params = {
                    'start': this.last,
                    'length': this.count
                };
                TravelService.getTravels(params).then(function(data) {
                    var items = data.data;
                    this.addItems(items);
                    this.busy = false;
                }.bind(this));
            };

            TravelList.prototype.addItems = function(items) {
                for (var i = 0; i < items.length; i++) {
                    items[i].start_dt_obj = new Date(items[i].start_dt.date.replace(' ', 'T'));
                    items[i].end_dt_obj = new Date(items[i].end_dt.date.replace(' ', 'T'));
                    this.items.push(items[i]);
                }
                this.last = this.last + items.length;
            };

            TravelList.prototype.removeItems = function() {
                this.items = [];
                this.last = 0;
            };

            TravelList.prototype.removeItem = function(item) {
                var key = this.items.indexOf(item);
                this.items.splice(key, 1);
            };

            TravelList.prototype.sort = function(order, reverse) {

            };

            return TravelList;
        }
    ]);