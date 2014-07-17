'use strict';

angular.module('dockerApp.controllers', [])
  .controller('AppCtrl', ['$scope',
    function($scope) {
      $scope.name = "Express Angular";
    }
  ])
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
  ])
  .controller('ContainerCtrl', ['$scope', '$routeParams', '$timeout', 'socket',
    function($scope, $routeParams, $timeout, socket) {
      var inputStream = ss.createStream();

      ss(socket).emit('attachContainer', inputStream, {
        containerId: $routeParams.id
      });

      ss(socket).on('terminalOutput', function (stream, data) {
        stream.on('data', function (data) {
          $scope.$apply(function () {
            $scope.content += data.toString();
            $timeout(function () {
            var shellWin = $('.pre-scrollable');
            if (shellWin) {
              shellWin.scrollTop(shellWin[0].scrollHeight);
            }
          });
          });
        })
      });

      $scope.content = '';

      $scope.send = function() {
        if ($scope.command) {
          inputStream.write($scope.command + '\r');
          $scope.command = '';
        }
      };

      $scope.clear = function () {
        $scope.content = '';
      };
    }
  ]);