'use strict';

angular
    .module('travelApp')
    .controller('ModalController', ['$scope', '$location', '$rootScope', '$uibModalInstance',
        function ( $scope, $location, $rootScope, $uibModalInstance) {
            console.log('modal controller');

            var today = new Date();
            var today_month = today.getMonth();
            var today_year = today.getFullYear();

            console.log(today_month);
            console.log(today_year);

            $scope.items = [];
            var getMonthSting = function(val){
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

            for (var i = 0; i<6; i++){
                if (today_month == 12){
                    today_month = 0;
                    today_year++;
                }
                var month_str = getMonthSting(today_month);
                $scope.items.push({
                    id: i,
                    month: today_month,
                    year: today_year,
                    monthStr: month_str
                });
                today_month++;
            }
            $scope.selected = $scope.items[0];

            $scope.ok = function () {
                $uibModalInstance.close($scope.selected);
            };

            $scope.cancel = function () {
                $uibModalInstance.dismiss('cancel');
            };
        }
    ]);
