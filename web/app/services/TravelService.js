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
                        params: (params)
                    });
                },
                createTravel: function(item){
                    return $http({
                        url: '/api/trips',
                        method: "POST",
                        data: $httpParamSerializerJQLike(item),
                        headers: {'Content-Type': 'application/x-www-form-urlencoded'}
                    });
                },
                deleteTravel: function(id){
                    return $http({
                        url: '/api/trips/'+id,
                        method: "DELETE"
                    });
                },
                editTravel: function(item, id){
                    return $http({
                        url: '/api/trips/'+id,
                        method: "PUT",
                        data: $httpParamSerializerJQLike(item),
                        headers: {'Content-Type': 'application/x-www-form-urlencoded'}
                    });
                }
            };
        }
    ]);
