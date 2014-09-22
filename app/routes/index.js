var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res) {
  res.render('index');
});

router.get('/views/images', function (req, res) {
  res.render('images')
});

router.get('/views/container', function (req, res) {
  res.render('container')
});

module.exports = router;
