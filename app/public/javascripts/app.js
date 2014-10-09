'use strict';

angular.module('dockerApp', [
  'ngRoute',
  'ngResource',
  'dockerApp.controllers',
  'dockerApp.services',
  'dockerApp.directives',
  'btford.socket-io'
])
.config(function ($routeProvider, $locationProvider) {
  $routeProvider
    .when('/', {
      templateUrl: '/views/images',
      controller: 'ImageCtrl'
    })
    .when('/containers/:id', {
      templateUrl: '/views/container',
      controller: 'ContainerCtrl'
    })
    .otherwise({
      redirectTo: '/'
    });
  $locationProvider.html5Mode(true);
});
