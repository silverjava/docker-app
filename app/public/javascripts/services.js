'use strict';

angular.module('dockerApp.services', [])
.factory('socket', ['socketFactory', function (socketFactory) {
    return socketFactory();
  }])
.factory('imageService', ['$resource',
  function ($resource) {
    var result = {};
    var Images = $resource('/api/images');
    result.list = function () {
      return Images.get().$promise;
    };
    return result;
  }])
.factory('containerService', ['$resource',
  function ($resource) {
    var result = {};
    var Containers = $resource('/api/containers');
    result.create = function (image) {
      return Containers.save({image: image}).$promise;
    };
    return result;
  }]);