'use strict';

angular
    .module('travelApp')
    .controller('ModalController', ['$scope', '$location', '$rootScope', '$uibModalInstance', 'CommonService',
        function ( $scope, $location, $rootScope, $uibModalInstance, CommonService) {
            console.log('modal controller');

            var today = new Date();
            var today_month = today.getMonth();
            var today_year = today.getFullYear();
            var common_service = new CommonService();

            console.log(today_month);
            console.log(today_year);

            $scope.items = [];

            for (var i = 0; i<6; i++){
                if (today_month == 12){
                    today_month = 0;
                    today_year++;
                }
                var month_str = common_service.getMonthSting(today_month)+ ' ' +today_year;
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
