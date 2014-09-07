'use strict';

angular.module('nnanimalsApp')
  .controller('NavbarCtrl', function ($scope, $location) {
     
    $scope.menu = [
    {
      'title': 'Home',
      'link': '/'
    },
     {
      'title': 'Neural Network',
      'link': '/neural'
    },
    {
      'title': 'KMeans',
      'link': '/kmeans'
    }
    ];
    
    $scope.isActive = function(route) {
      return route === $location.path();
    };
  });
  