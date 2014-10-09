'use strict';

angular.module('dockerApp.directives', [])
    .directive('terminal', ['$timeout', function($timeout) {
        return {
            // scope: {}, // {} = isolate, true = child, false/undefined = no change
            restrict: 'E', // E = Element, A = Attribute, C = Class, M = Comment
            template: '<div></div>',
            replace: true,
            link: function($scope, iElm, iAttrs, controller) {
                iElm.terminal(function(command, term) {
                    term.echo(command);
                }, {
                    greetings: '',
                    name: '',
                    height: 400,
                    prompt: 'root> '
                });

                $scope.$on("$destroy",function(){
                  iElm.destroy();
                });
            }
        };
    }]);
