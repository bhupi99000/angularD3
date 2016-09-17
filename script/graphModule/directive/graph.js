(function(){
    'use strict';
    angular.module('d3Angular.graphModule.directive').directive('graph', [function(){
        var ddo = {
            restrict: 'EA',
            template: '<svg width="850" height="600" id="chart"></svg>',
            scope: {
                data: '='
            },
            link: function(scope, element, attr){
                // scope.$watch('data', function(newVal, oldVal){
                    var chart = d3Utils({
                        elm: 'chart',
                        data: scope.data,
                        chartType: 'bar'
                    });

                setTimeout(function(){
                    chart.updateBarChart([
                        {key: 'Glazed', value: 132},
                        {key: 'Jelly', value: 71},
                        {key: 'Cruller', value: 30},
                        {key: 'Eclair', value: 8},
                        {key: 'Fritter', value: 17},
                        {key: 'Bearclaw', value: 21},
                        {key: 'Chocolate', value: 43},
                        {key: 'Coconut', value: 20},
                        {key: 'Cream', value: 16},
                        {key: 'Cruller', value: 93},
                        {key: 'Eclair1', value: 88},
                        {key: 'Fritter1', value: 117},
                        {key: 'Bearclaw1', value: 121},
                        {key: 'Chocolate1', value: 143},
                        {key: 'Coconut1', value: 120},
                        {key: 'Cream1', value: 160},
                        {key: 'Cruller1', value: 125},
                        {key: 'Eclair2', value: 18},
                        {key: 'Fritter2', value: 24},
                        {key: 'Bearclaw2', value: 36}
                    ])
                }, 5000);
                // });
            }
        };
        return ddo;
    }]);
}());