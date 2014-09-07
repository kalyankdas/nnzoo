'use strict';

angular.module('nnanimalsApp', [
    'ui.bootstrap',
  'ngCookies',
  'ngResource',
  'ngSanitize',
  'ngRoute',
  'ngGrid'


])
  .config(function ($routeProvider, $locationProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'partials/main',
        controller: 'MainCtrl'
      })
      
      .when('/neural', {
        templateUrl: 'partials/neural',
        controller: 'NeuralCtrl'
      })
      .when('/kmeans', {
        templateUrl: 'partials/kmeans',
        controller: 'KmeansCtrl'
      }
      )
      .otherwise({
        redirectTo: '/'
      });
      
    $locationProvider.html5Mode(true);
  });