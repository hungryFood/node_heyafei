var express = require('express');
var router = express.Router();
let mgdb = require("../../common/mgdb.js")
router.get('/', function(req, res, next) {
  res.render('./login.ejs',{});
});
router.post('/submit',function(req,res,next){
  let {username,password} = req.body;
  mgdb({collection:"admin"},(collection,client,ObjectID)=>{
    collection.find(
      {username:username,password:password},
      {_id:0}
      ).toArray((err,result)=>{
        if(!err && result.length>0){
          let name = result[0].username;
          // res.redirect('/admin/success?msg=登录成功，欢迎'+ name +'')
          // 存cookie和session
          // req.session.a=1
          req.session.username = result[0].username;
          req.session.icon = result[0].icon;
          req.session.work = result[0].work;
          // console.log(req.session.work)
          res.redirect('/admin/home');
            // console.log('查看查看',result)//只有登录的账号库里有存才会打印
        }else{
          res.redirect('/admin/error?msg="登录失败，账号密码不符"')//这是地址栏链接，不是ejs文件
        }
    })
  })
});

module.exports = router;