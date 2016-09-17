(function(){
    'use strict';

    angular.module('d3Angular.graphModule', [
        'd3Angular.graphModule.controller',
        'd3Angular.graphModule.directive',
        'd3Angular.graphModule.service'
    ])
        .config(['$stateProvider', '$urlRouterProvider', function($stateProvider, $urlRouterProvider){
            $stateProvider.state('graphHome', {
                url: '/graphHome',
                templateUrl: 'script/graphModule/view/graphHome.html',
                controller: 'graphController',
                controllerAs: 'graphCtrl'
            });
        }]);
}());