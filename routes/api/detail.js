var express = require('express');
var router = express.Router();
let path = require("path");
let fs = require("fs");
let mgdb = require("../../common/mgdb");
let uploadUrl = require('../../config/global.js').upload.product;
//拿到修改之前的数据
router.get('/', function(req, res, next) {
  console.log('22222222222222222222')
  let dataName = req.query.dataName;
  // console.log(req.query)
  // console.log(req.query._id)
  let id = req.query._id;
  // console.log(dataName,id)
  if(!dataName || !id){
    res.send('msg=dataName和_id为必填参数')
    return; 
  }
  let start = req.query.start ? req.query.start : require("../../config/global.js").page_start;
  let count = req.query.count ? req.query.count : require("../../config/global.js").page_num;
  let rule = req.query.rule ? req.query.rule : require("../../config/global.js").rule;
  let q = req.query.q ? req.query.q : require("../../config/global.js").q;

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
      if(!err){
        data = {
          ...data,page_data:result[0],
        }
        let cResult =  result.slice(start*count,start*count+count)
        data = {
          ...data,
          start:start+1,count
        }
        res.send({err:0,msg:'成c功',data:data})
        // console.log("++++++++++++++++++",data)
      }
      client.close();
    })
  })
});


module.exports = router;