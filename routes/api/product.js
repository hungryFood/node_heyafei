var express = require('express');
var router = express.Router();
let path = require("path");
let fs = require("fs");
let mgdb = require("../../common/mgdb");
let uploadUrl = require('../../config/global.js').upload.product;

router.get('/', function(req, res, next) {
  // console.log('1111111111111111111111111111111111111')
  let dataName = req.query.dataName;
  if(!dataName){
    res.send('msg=dataName为必填参数')
  }
  
  let start = req.query.start ? req.query.start-1 : require("../../config/global.js").page_start-1;
  let count = req.query.count ? req.query.count-0 : require("../../config/global.js").page_num;
  let rule = req.query.rule ? req.query.rule : require("../../config/global.js").rule;
  let q = req.query.q ? req.query.q : require("../../config/global.js").q;

  let data = {
    cookiesession:req.cookiesession,
    dataName:dataName,
    active:dataName,
    page_header:dataName + '列表',
    start:start+1,count,rule,q,api_name:"product"
  }
  mgdb({collection:dataName},(collection,client)=>{
        collection.find(q ? {title:eval('/'+q+'/g')} : {},{projection:{_id:1,title:1,des:1},sort:rule ? {[rule]:-1} : {time:-1}}).toArray((err,result)=>{
            if(!err){
              let cResult =  result.slice(start*count,start*count+count)
              data = {
                ...data,
                page_data:cResult,//要分页的数据 
                page_cont:Math.ceil(result.length/count),//总页数
                total:result.length,
                start:start+1,count
              }
              // console.log(result)//是所有的数据
              // console.log('sasassas',data)
               
                res.send({err:0,msg:'成功',data:data});
            }
            client.close();
        })
    })
});
module.exports = router;