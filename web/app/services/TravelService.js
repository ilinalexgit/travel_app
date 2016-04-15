'use strict';

angular
    .module('travelApp')
    .factory('TravelService', ['$rootScope', '$http', '$httpParamSerializerJQLike',
        function ($rootScope, $http, $httpParamSerializerJQLike) {
            return {
                getTravels: function(params){
                    return $http({
                        url: '/api/trips',
                        method: "GET",
                        data: $httpParamSerializerJQLike(params),
                        headers: {'Content-Type': 'application/x-www-form-urlencoded'}
                    });
                },
                createTravels: function(){},
                deleteTravels: function(){},
                editTravels: function(){}
            };
        }
    ]);
