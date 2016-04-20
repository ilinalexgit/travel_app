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

            TravelList.prototype.nextPage = function(params) {
                console.log(88888);
                if (this.busy) return;
                this.busy = true;

                params.start = this.last;
                params.length = this.count;

                TravelService.getTravels(params).then(function(data) {
                    var items = data.data;
                    this.addItems(items);
                    this.busy = false;
                }.bind(this));
            };

            TravelList.prototype.getDiff = function(start, end) {
                var timeDiff = Math.abs(end.getTime() - start.getTime());
                var diffDays = Math.ceil(timeDiff / (1000 * 3600 * 24));

                var res = {};
                res.diffDays = diffDays;
                if (diffDays == 0){
                    res.diffStr = 'Today';
                }else{
                    if (diffDays.toString().slice(-1) == '1' && diffDays.toString().slice(-2) != '11'){
                        res.diffStr = 'in ' + diffDays + ' day';
                    }else{
                        res.diffStr = 'in ' + diffDays + ' days';
                    }
                }

                return res;
            };

            TravelList.prototype.addItems = function(items) {
                for (var i = 0; i < items.length; i++) {
                    items[i].start_dt_obj = new Date(items[i].start_dt.date.replace(' ', 'T'));
                    items[i].end_dt_obj = new Date(items[i].end_dt.date.replace(' ', 'T'));

                    var diff_obj = this.getDiff(items[i].start_dt_obj, items[i].end_dt_obj);
                    items[i].diff = diff_obj.diffDays;
                    items[i].diff_str = diff_obj.diffStr;

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