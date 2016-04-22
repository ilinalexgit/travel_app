'use strict';

angular
    .module('travelApp')
    .factory('CommonService', ['$rootScope',
        function ($rootScope) {
            var CommonService = function() {
            };

            CommonService.prototype.expand = function(item, showEl, scope) {
                if (scope.inserted){
                    scope.inserted = null;
                }
                if (scope.current_opened_el && scope.current_opened != item){
                    scope.current_opened_el.$cancel();
                    showEl.$show();
                }else if(scope.current_opened != item){
                    showEl.$show();
                }

                scope.current_opened = item;
                scope.current_opened_el = showEl;
            };

            CommonService.prototype.cancel = function($event, scope) {
                if (scope.inserted){
                    scope.inserted = null;
                }else{
                    scope.current_opened_el.$cancel();
                    scope.current_opened = false;
                    scope.current_opened_el = false;
                    $event.preventDefault();
                    $event.stopPropagation();
                }
            };


            CommonService.prototype.getMonthSting = function(val){
                var month = [];
                month[0] = "January";
                month[1] = "February";
                month[2] = "March";
                month[3] = "April";
                month[4] = "May";
                month[5] = "June";
                month[6] = "July";
                month[7] = "August";
                month[8] = "September";
                month[9] = "October";
                month[10] = "November";
                month[11] = "December";

                return month[val];
            };

            CommonService.prototype.dateFormat = function(date){
                var day = date.getDate();
                var monthIndex = date.getMonth();
                var year = date.getFullYear();

                monthIndex++;

                return (year + '-' + [monthIndex] + '-' + day);
            };

            return CommonService;
        }
    ]);