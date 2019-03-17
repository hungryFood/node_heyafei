var express = require('express');
var router = express.Router();
let path = require("path");
let fs = require("fs");
let mgdb = require("../../common/mgdb");
let uploadUrl = require('../../config/global.js').upload.product;

router.get('/', function(req, res, next) {
  let dataName = req.query.dataName;
  if(!dataName){
    res.redirect('/admin/error?msg=dataName为必填参数')
  }
  let start = req.query.start ? req.query.start-1 : require("../../config/global.js").page_start-1;
  let count = req.query.count ? req.query.count-0 : require("../../config/global.js").page_num;
  let rule = req.query.rule ? req.query.rule : require("../../config/global.js").rule;
  let q = req.query.q ? req.query.q : require("../../config/global.js").q;

  let data = {cookiesession:req.cookiesession,
    page_header:"用户",
    dataName:dataName,
    active:dataName,
    start:start+1,count,rule,q,api_name:"user",time:Date.now()
  }
  mgdb({collection:dataName},(collection,client)=>{
    collection.find(q ? {nikename:eval('/'+q+'/g')} : {},
    {projection:{_id:1,nikename:1,auth_icon:1,follow:1,fans:1,time:1},sort:rule ? {[rule]:-1} : {time:-1}}).toArray((err,result)=>{
        if(!err){
          let cResult =  result.slice(start*count,start*count+count)
          data = {
            ...data,
            page_data:cResult,//要分页的数据 
            page_cont:Math.ceil(result.length/count)//总页数
          }
          // console.log(result)//是所有的数据
          // console.log('--------------------',data)
            res.render('./user.ejs',data);
        }else{
            console.log("错误而错误",result)
            res.redirect('/admin/error?msg=没有找到');
        }
        client.close();
    })
  })
});
router.use('/add',require('./user/add.js'))
router.use('/del',require('./user/del.js'))
router.use('/change',require('./user/change.js'))
module.exports = router;