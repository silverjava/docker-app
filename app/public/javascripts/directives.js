'use strict';

angular.module('dockerApp.directives', [])
  .directive('term', ['$timeout', '$routeParams', 'socket', function($timeout, $routeParams, socket) {
    return {
      restrict: 'E',
      template: '<div></div>',
      replace: true,
      link: function($scope, iElm, iAttrs, controller) {
        var terminal = new Terminal();
        terminal.open();

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
      }
    };
  }]);;
