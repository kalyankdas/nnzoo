'use strict';

angular.module('nnanimalsApp')
  .controller('KmeansCtrl', function ($scope, $http) {
      $scope.animals = [];
      
     
     $http.get('/api/animals').success(function(data) {
         $scope.animals = data;
          if (!$scope.$$phase) {
              $scope.$apply();

          }
         // alert('hi');
    });

      $scope.clusterData = {};

      $scope.kmeans = function() {
            $http.get('/api/kmeans').success(function(data) {
                $scope.clusterData = data;
                  if (!$scope.$$phase) {
                        $scope.$apply();
                   }
                console.log(data);
              
            });
      };

  });
