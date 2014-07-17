var images = require('../services/docker').images;
var containers = require('../services/docker').containers;
var express = require('express');
var router = express.Router();

router.get('/images', function (req, res) {
  images.list().then(function (data) {
    res.json({
      images: data
    });
  });
});

router.post('/containers', function (req, res) {
  var image = req.body.image;
  containers.create(image.RepoTags[0]).then(function (container) {
    res.json({
      id: container.id
    });
  });
});

module.exports = router;
