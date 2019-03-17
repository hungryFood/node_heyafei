var express = require('express');
var router = express.Router();

router.get('/', function(req, res, next) {
  delete req.session.username;
  res.redirect('/admin/login');
});

module.exports = router;