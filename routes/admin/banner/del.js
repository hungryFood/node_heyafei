var express = require('express');
var router = express.Router();
let mgdb = require("../../../common/mgdb");

router.get('/', function(req, res, next) {
  let dataName = req.query.dataName;
  let id = req.query._id;
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
    page_header:dataName,
    active:dataName,
    start:start,
    count:count,
    rule:rule,
    q:q
  }
  mgdb({collection:dataName},(collection,client,ObjectID)=>{
    collection.deleteOne({_id:ObjectID(id)},(err,result)=>{
        if(!err && result.result.n){
            res.redirect("/admin/banner?dataName="+dataName+"&start="+start+"&count="+count+"&rule="+rule+"&q="+q)
        }else{
          res.redirect("/admin/error?msg=删除失败,请检查id是否正确")
        }
    })
  })
});

module.exports = router;