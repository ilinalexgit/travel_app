'use strict';

angular
    .module('travelApp')
    .factory('CommonService', ['$rootScope',
        function ($rootScope) {
            var CommonService = function() {
            };

            CommonService.prototype.expand = function(item, showEl, scope) {
                console.log('expand');
                console.log(showEl);
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

            return CommonService;
        }
    ]);