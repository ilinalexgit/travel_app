'use strict';

angular
    .module('travelApp')
    .factory('TravelListService', ['$rootScope', 'TravelService',
        function ($rootScope, TravelService) {
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


myApp.factory('Reddit', function($http) {
    var Reddit = function() {
        this.items = [];
        this.busy = false;
        this.after = '';
    };

    Reddit.prototype.nextPage = function() {
        if (this.busy) return;
        this.busy = true;

        var url = "https://api.reddit.com/hot?after=" + this.after + "&jsonp=JSON_CALLBACK";
        $http.jsonp(url).success(function(data) {
            var items = data.data.children;
            for (var i = 0; i < items.length; i++) {
                this.items.push(items[i].data);
            }
            this.after = "t3_" + this.items[this.items.length - 1].id;
            this.busy = false;
        }.bind(this));
    };

    return Reddit;
});