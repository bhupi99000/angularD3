(function(){
    'use strict';

    angular.module('d3Angular', [
            'ui.router',
            'd3Angular.graphModule'
        ])
        .config(['$stateProvider', '$urlRouterProvider', function($stateProvider, $urlRouterProvider){
            $urlRouterProvider.otherwise('/graphHome');
        }]);
}());