var express = require('express');
var router = express.Router();
let path = require("path");
let fs = require("fs");
let mgdb = require("../../../common/mgdb");
let uploadUrl = require('../../../config/global.js').upload.banner;
//拿到修改之前的数据
router.get('/', function(req, res, next) {
  console.log('AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA',req.body)
  console.log('BBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBB',req.files)
  let dataName = req.query.dataName;
  // console.log(req.query)
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
    q:q,
    
  }
//改之前先找
  mgdb({collection:dataName},(collection,client,ObjectID)=>{
    collection.find({_id:ObjectID(id)}).toArray((err,result)=>{
      if(!err && result.length>0){
        data = {
          ...data,page_data:result[0]
        }
        console.log("++++++++++++++++++",data)
        res.render("banner/change",data)
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
  let {title,sub_title,auth,content,banner_old,icon_old,banner,auth_icon} = req.body;
  //判断传没传头像，穿了改名，没传用默认
  req.files.forEach((file,index)=>{
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
  //提交的时候存库；
  console.log('AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA',req.body)
  console.log('BBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBB',req.files)
  mgdb({collection:dataName},(collection,client,ObjectID)=>{
        collection.updateOne({_id:ObjectID(id)},{$set:{
          ...req.body,start,count,rule,q,dataName,
          detail:{
            auth_icon:auth_icon
          }
        }},{upsert:false,projection:true},(err,result)=>{
          if(!err && result.result.n){
            res.send("/admin/banner/?dataName="+ dataName +"&start="+start+"&rule="+rule+"&q="+q+"&count="+count)
          }else{
            res.send("/admin/error?msg=product修改失败")
          }
            client.close()
        })
    })
})


module.exports = router;


//修改提交的数据
// router.post('/submit',function(req,res,next){
//   let dataName = req.body.dataName;
//   let id = req.body.id;
//   if(!dataName){
//     res.send('/admin/error?msg=dataName为必传参数，但你没传');
//     return;
//   } 
//   let start = req.body.start ? req.body.start-0 : require("../../../config/global.js").page_start;
//   let count = req.body.count ? req.body.count-0 : require("../../../config/global.js").page_num;
//   let rule = req.body.rule ? req.body.rule : require("../../../config/global.js").rule;
//   let q = req.body.q ? req.body.q : require("../../../config/global.js").q;
//   let {title,auth,content,banner_old,icon_old,sub_title} = req.body;
//   let auth_icon,banner;
//   req.files.forEach((file,index)=>{
//     //抓取到对应图片
//     if(file.fieldname==='auth_icon'){
//       auth_icon = uploadUrl + file.filename + path.parse(file.originalname).ext;
//     }
//     if(file.fieldname==='banner'){
//       banner = uploadUrl + file.filename + path.parse(file.originalname).ext;
//     }
//     fs.renameSync(//本地图片命名
//       file.path,
//       file.path+path.parse(file.originalname).ext
//     )
//   })
//   //选默认图片
//   if(!banner) banner = '/upload/noimage.png';
//   if(!auth_icon) auth_icon = '/upload/noimage.png';
// //   //操作库

//   mgdb({collection:dataName},(collection,client,ObjectID)=>{
//     collection.updateOne({_id:ObjectID(id)},{$set:{title:title,
//       banner:banner,
     
//       sub_title:sub_title,
//       detail:{
//         auth:auth,
//         content:content, auth_icon:auth_icon,
//       }
//     }},{upsert:false,projection:true},(err,result)=>{
//       // console.log('hahahahahahahahhahahahahaha',err)
//       console.log('a啊啊啊啊啊 啊啊啊啊啊啊',result.result.n)
//       if(!err && result.result.n){
//         res.send("/admin/banner?dataName="+ dataName +"&start="+start+"&rule="+rule+"&q="+q+"&count="+count)
//       }else{
//         res.send("/admin/error?msg=banner修改失败")
//       }
//         client.close()
//     })
//   })
// })

// module.exports = router;