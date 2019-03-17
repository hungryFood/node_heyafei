var express = require('express');
var router = express.Router();

router.get('/', function(req, res, next) {
  // console.log("家家++++",req.cookiesession)
  let data = {cookiesession:req.cookiesession,active:"index",page_header:"首页"}
  res.render('./home.ejs',data);
});


module.exports = router;