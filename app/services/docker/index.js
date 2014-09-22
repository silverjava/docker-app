var Q = require('q');
var Docker = require('dockerode');
var docker = new Docker({socketPath: '/var/run/docker.sock'});

var images = {};
var containers = {};

// start for images
images.list = function () {
  var deferred = Q.defer();
  docker.listImages({}, function (err, data) {
    if (err) {
      deferred.reject(err);
    } else {
      deferred.resolve(data);
    }
  });
  return deferred.promise;
};

// start for containers
containers.create = function (image) {
  var optsc = {
    'Hostname': '',
    'User': '',
    'AttachStdin': true,
    'AttachStdout': true,
    'AttachStderr': true,
    'Tty': true,
    'OpenStdin': true,
    'StdinOnce': false,
    'Env': null,
    'Cmd': ['bash'],
    'Dns': ['8.8.8.8', '8.8.4.4'],
    'Image': image,
    'Volumes': {},
    'VolumesFrom': ''
  };
  var deferred = Q.defer();

  docker.createContainer(optsc, function(err, container) {
    if (err) {
      deferred.reject(err);
    } else {
      deferred.resolve(container);
    }
  });
  return deferred.promise;
};

containers.attach = function (containerId, stdin, stdout) {
  var container = docker.getContainer(containerId);
  var attach_opts = {
      stream: true,
      stdin: true,
      stdout: true,
      stderr: true
    };

  container.attach(attach_opts, function (err, stream) {
    stdin.pipe(stream).pipe(stdout);

    stdin.on('close', function () {
      container.stop({}, function(err, data) {
          console.log("container ", container.id, " has been stopped.");
      });
      container.remove({}, function(err, data) {
        console.log("container ", container.id, " has been removed.");
      });
    });

    container.start(function (err, data) {
      console.log("container ", container.id, " has been attached.");
    });
  });
};

module.exports = {
  images: images,
  containers: containers
}
