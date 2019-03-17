var express = require('express');
var router = express.Router();
let path = require("path");
let fs = require("fs");
let mgdb = require("../../../common/mgdb");
let uploadUrl = require('../../../config/global.js').upload.product;
router.get('/', function(req,res,next){
  let dataName = req.query.dataName;
  if(!dataName){
    res.redirect('/admin/error?msg=dataName为必传参数，但你没传');
    return; 
  }
  //在这拿公共数据
  let data = {cookiesession:req.cookiesession,
    dataName:dataName,
    page_header:dataName + "添加",
    active:dataName
  }
  res.render('./product/add.ejs',data);
});

//上传时要做的事情
router.post('/submit',function(req,res,next){
  //product  add的时候，先判断传没传dataName,没传跳到error页面，传了拿到req.body的
  //内容
  let dataName = req.body.dataName;
  if(!dataName){
    res.send('/admin/error?msg=dataName为必传参数，但你没传');
    return;
  } 
  //在这拿提交上来的所有东西
  
  let {title,des,auth,content} = req.body;
  let time = Date.now();
  //判断传没传头像，穿了改名，没传用默认
  let auth_icon = req.files.length ? uploadUrl + req.files[0].filename + path.parse(req.files[0].originalname).ext : '';
  if(auth_icon){
    fs.renameSync(req.files[0].path,req.files[0].path + path.parse(req.files[0].originalname).ext);
  }else{
    auth_icon = '/upload/noimage.png';
  }
  // console.log({title,des,auth,content,dataName,time,auth_icon})
  // console.log(req.body)
  // console.log(req.files)
  //提交的时候存库；
  mgdb({collection:dataName},(collection,client)=>{
    // console.log(auth_icon)
    collection.insertOne({
      title:title,
      des:des,
      time:time,
      detail:{
        auth:auth,
        content:content,
        auth_icon:auth_icon
      }
    },(err,result)=>{
      if(!err && result.result.n){
        res.send("/admin/product/?dataName="+ dataName +"&start=1")
      }else{
        res.send("/admin/error?msg=product.add存库失败")
      }
      client.close()
    })
  })
})

module.exports = router;