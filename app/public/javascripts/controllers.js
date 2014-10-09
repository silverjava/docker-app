'use strict';

angular.module('dockerApp.controllers', [])
  .controller('ImageCtrl', ['$scope', '$location', 'imageService', 'containerService',
    function($scope, $location, imageService, containerService) {
      imageService.list().then(function(data) {
        $scope.images = data.images;
      });

      $scope.startContainer = function() {
        containerService.create($scope.image).then(function(data) {
          $scope.containerCreated = true;
          $location.path('/containers/' + data.id.substring(0, 12));
        });
      };
    }
  ]);
