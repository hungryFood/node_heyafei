var express = require('express');
var router = express.Router();
let path = require("path");
let fs = require("fs");
let mgdb = require("../../../common/mgdb");
let uploadUrl = require('../../../config/global.js').upload.banner;

router.get('/', function(req, res, next) {
  let dataName=req.query.dataName;
  if(!dataName){
    res.redirect('/admin/error?msg=dataName为必传单数')
    return;
  }
    //在这拿公共数据
  let data = {cookiesession:req.cookiesession,
    dataName:dataName,
    page_header:dataName + "添加",
    active:dataName,
  }
  res.render('./banner/add.ejs',data);
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
  //判断上传的图片,循环解决
  let auth_icon,banner;
  req.files.forEach((file,index)=>{
    //抓取到对应图片
    if(file.fieldname==='auth_icon'){
      auth_icon = uploadUrl + file.filename + path.parse(file.originalname).ext;
    }
    if(file.fieldname==='banner'){
      banner = uploadUrl + file.filename + path.parse(file.originalname).ext;
    }
    fs.renameSync(//本地图片命名
      file.path,
      file.path+path.parse(file.originalname).ext
    )
  })
  //选默认图片
  if(!banner) banner = '/upload/noimage.png';
  if(!auth_icon) auth_icon = '/upload/noimage.png';
  console.log('草草草草草草草',req.body)
  //在这拿提交上来的所有东西
  let time = Date.now();
  mgdb({collection:dataName},(collection,client)=>{
        collection.insertOne({
          ...req.body,banner,
          detail:{
            ...req.body.detail,time,auth_icon,
          }
        },(err,result)=>{
          // console.log('作者作者',auth_icon)
          // console.log('广告广告',banner)
          if(!err && result.result.n){
            res.send('/admin/banner?dataName='+dataName+'&start=1')
          }else{
            res.send('/admin/error?&msg='+dataName+'集合链接有误')
          }
          client.close();
        }
      )
    }
  );
})

module.exports = router;