var express = require('express');
var router = express.Router();
let path = require("path");
let fs = require("fs");
let mgdb = require("../../../common/mgdb");
let uploadUrl = require('../../../config/global.js').upload.product;
//拿到修改之前的数据
router.get('/', function(req, res, next) {
  let dataName = req.query.dataName;
  console.log(req.query)
  // console.log(req.query._id)
  let id = req.query._id;
  // console.log(dataName,id)
  if(!dataName || !id){
    res.redirect('/admin/error?msg=dataName和_id为必传参数，但你没传');
    return; 
  }
  let start = req.query.start ? req.query.start : require("../../../config/global.js").page_start;
  let count = req.query.count ? req.query.count : require("../../../config/global.js").page_num;
  let rule = req.query.rule ? req.query.rule : require("../../../config/global.js").rule;
  let q = req.query.q ? req.query.q : require("../../../config/global.js").q;

  let data = {cookiesession:req.cookiesession,
    dataName:dataName,
    page_header:dataName + "修改",
    active:dataName,
    start:start,
    count:count,
    rule:rule,
    q:q
  }
//改之前先找
  mgdb({collection:dataName},(collection,client,ObjectID)=>{
    collection.find({_id:ObjectID(id)}).toArray((err,result)=>{
      if(!err && result.length>0){
        data = {
          ...data,page_data:result[0]
        }
        // console.log("++++++++++++++++++",data)
        res.render("product/change",data)
      }else{
        res.redirect("/admin/error?msg=没有找到相关数据，请检查id是否正确")
      }
      client.close();
    })
  })
});
//修改提交的数据
router.post('/submit',function(req,res,next){
  //product  add的时候，先判断传没传dataName,没传跳到error页面，传了拿到req.body的
  //内容
  let dataName = req.body.dataName;
  // console.log("bbbbbbbbbbbbbbbbbbbbb",req.body)
  let id = req.body.id;
  if(!dataName){
    res.send('/admin/error?msg=dataName为必传参数，但你没传');
    return;
  } 
  let start = req.body.start ? req.body.start-0 : require("../../../config/global.js").page_start;
  let count = req.body.count ? req.body.count-0 : require("../../../config/global.js").page_num;
  let rule = req.body.rule ? req.body.rule : require("../../../config/global.js").rule;
  let q = req.body.q ? req.body.q : require("../../../config/global.js").q;
  //在这拿提交上来的所有东西
  let {title,des,auth,content,oldImg} = req.body;
  //判断传没传头像，穿了改名，没传用默认
  let auth_icon = req.files.length ? uploadUrl + req.files[0].filename + path.parse(req.files[0].originalname).ext : '';
  if(auth_icon){
    fs.renameSync(req.files[0].path,req.files[0].path + path.parse(req.files[0].originalname).ext);
  }else{
      auth_icon = oldImg;
  }
  // console.log({title,des,auth,content,dataName,time,auth_icon})
  // console.log(req.body)
  // console.log(req.files)
  //提交的时候存库；
  // console.log("idididididididididididididi",id)
  mgdb({collection:dataName},(collection,client,ObjectID)=>{
        collection.updateOne({_id:ObjectID(id)},{$set:{title:title,
          des:des,
          detail:{
            auth:auth,
            content:content,
            auth_icon:auth_icon
          }
        }},{upsert:false,projection:true},(err,result)=>{
          if(!err && result.result.n){
            res.send("/admin/product/?dataName="+ dataName +"&start="+start+"&rule="+rule+"&q="+q+"&count="+count)
          }else{
            res.send("/admin/error?msg=product修改失败")
          }
            client.close()
        })
    })
})


module.exports = router;