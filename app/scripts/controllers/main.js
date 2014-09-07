'use strict';

angular.module('nnanimalsApp')
  .controller('MainCtrl', function ($scope, $http) {
      $scope.animals = [];
     

     $http.get('/api/animals').success(function(data) {
         $scope.animals = data;
          if (!$scope.$$phase) {
              $scope.$apply();

          }
         // alert('hi');
    });


     

  });
