'use strict';

angular
    .module('travelApp.sort', [])
    .directive("sort", function() {
        return {
            restrict: 'A',
            transclude: true,
            template :
                '<a ng-click="onClick()">'+
                    '<span ng-transclude></span>'+
                    '<i class="glyphicon" ng-class="{\'glyphicon glyphicon-chevron-up\' : order === by && !reverse,  \'glyphicon glyphicon-chevron-down\' : order===by && reverse}"></i>'+
                '</a>',
            scope: {
                order: '=',
                by: '=',
                reverse : '=',
                updateMethod: '='
            },
            link: function(scope, element, attrs) {
                scope.onClick = function () {
                    var simpleSort = function(){
                        if( scope.order === scope.by ) {
                            scope.reverse = !scope.reverse
                        } else {
                            scope.by = scope.order ;
                            scope.reverse = false;
                        }
                    };

                    if (scope.order == 'diff'){
                        simpleSort();
                    }else{
                        var tmp_reverse = false;
                        if( scope.order === scope.by ) {
                            tmp_reverse = !scope.reverse
                        }
                        scope.updateMethod({'order':scope.order, 'reverse':tmp_reverse}).then(function(){
                            simpleSort();
                        });
                    }

                }
            }
        }
    });