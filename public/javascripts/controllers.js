'use strict';

angular.module('dockerApp.controllers', [])
  .controller('AppCtrl', ['$document', '$scope',
    function($document, $scope) {
      $scope.name = "Express Angular";
      $document.keydown(function(event) {
        // tab
        if (event.keyCode === 9) {
          $scope.$apply(function () {
            $scope.$broadcast('tab');
          });
          return false;
        }
        // backspace
        if (event.keyCode === 8) {
          $scope.$apply(function () {
            $scope.$broadcast('backspace');
          });
        }
        // enter
        if (event.keyCode === 13) {
          $scope.$apply(function () {
            $scope.$broadcast('enter');
          });
          return false;
        }
        // ctrl + c
        if (event.ctrlKey && event.keyCode === 67) {
          $scope.$apply(function() {
            $scope.$broadcast('Ctrl+C');
          });
          return false;
        }
      });
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

      $scope.$on('tab', function (event) {
        inputStream.write($scope.command + '\t\t');
        $scope.command = '';
      });

      $scope.$on('enter', function (event) {
        inputStream.write($scope.command + '\n');
        $scope.command = '';
      });

      $scope.$on('Ctrl+C', function (event) {
        inputStream.write('\u0003');
        $scope.command = '';
      });

      $scope.$on('backspace', function (event) {
        inputStream.write('\b');
      });

      ss(socket).emit('attachContainer', inputStream, {
        containerId: $routeParams.id
      });

      ss(socket).on('terminalOutput', function(stream, data) {
        stream.on('data', function (data) {
          $scope.$apply(function() {
            $scope.content += data;
            $timeout(function() {
              var shellWin = $('.pre-scrollable');
              if (shellWin) {
                shellWin.scrollTop(shellWin[0].scrollHeight);
              }
            });
          });
        })
      });

      $scope.content = '';
      $scope.command = '';
    }
  ]);
