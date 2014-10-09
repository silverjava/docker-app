'use strict';

angular.module('dockerApp.directives', [])
  .directive('term', ['$timeout', '$routeParams', 'socket', function($timeout, $routeParams, socket) {
    return {
      restrict: 'E',
      template: '<span></span>',
      replace: true,
      link: function($scope, iElm, iAttrs, controller) {
        var terminal = new Terminal({
          cols: 80,
          rows: 24,
          useStyle: true,
          screenKeys: true,
          cursorBlink: false
        });
        terminal.open();
        terminal.write('\x1b[31mSession started !\x1b[m\r\n');

        var inputStream = ss.createStream();

        terminal.on('data', function(data) {
          inputStream.write(data);
        });

        ss(socket).emit('attachContainer', inputStream, {
          containerId: $routeParams.id
        });

        ss(socket).on('terminalOutput', function(stream, data) {
          stream.on('data', function(data) {
            terminal.write(data + "");
          })
        });

        $scope.$on('$destroy', function() {
          terminal.destroy();
        });
      }
    };
  }]);;
