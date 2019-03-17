module.exports = (req,res,next)=>{
  // console.log("我在守")
  if(req.session.username){
    req.cookiesession = {username:req.session.username,icon:req.session.icon,work:req.session.work};//服务器关闭会消失
    // console.log(req.cookiesession)//{ username: 'alex', icon: '/img/icon2.png' }
    // let start = req.body.start ? req.body.start-0 : require("../../../config/global.js").page_start;
    // let count = req.body.count ? req.body.count-0 : require("../../../config/global.js").page_num;
    // let rule = req.body.rule ? req.body.rule : require("../../../config/global.js").rule;
    // let q = req.body.q ? req.body.q : require("../../../config/global.js").q;
    // let dataName = req.query.dataName;
    // let active = dataName;
    // let page_header = dataName
    // res.public = {start,count,rule,q,dataName,active,page_header}

    next();
  }else{
    res.redirect('/admin/login')
  }
}



// var express = require('express');
// var router = express.Router();

// router.get('/', function(req, res, next) {
//   res.send('islogin');
// });

// module.exports = router;