var express = require('express');
var router = express.Router();
var mgdb = require('../../common/mgdb');


router.get('/', function(req, res, next) {
  let dataName=req.query.dataName;
  if(!dataName){
    res.redirect('/admin/error?msg=dataName为必传单数')
    return;
  }
  let start = req.query.start ? req.query.start-1 : require("../../config/global.js").page_start-1;
  let count = req.query.count ? req.query.count-0 : require("../../config/global.js").page_num;
  let rule = req.query.rule ? req.query.rule : require("../../config/global.js").rule;
  let q = req.query.q ? req.query.q : require("../../config/global.js").q;
  let data = {cookiesession:req.cookiesession,
    page_header:"主屏广告",
    dataName:dataName,
    page_header:dataName,
    active:dataName,
    start:start+1,count,rule,q,api_name:"banner"
  }
  mgdb({collection:dataName},(collection,client)=>{
    collection.find(q ? {title:eval('/'+q+'/g')} : {},{projection:{_id:1,title:1,sub_title:1},sort:rule ? {[rule]:-1} : {time:-1}}).toArray((err,result)=>{
        if(!err){
          let cResult =  result.slice(start*count,start*count+count)
          data = {
            ...data,
            page_data:cResult,//要分页的数据 
            page_cont:Math.ceil(result.length/count)//总页数
          }
          // console.log(result)//是所有的数据
          console.log(data)
            res.render('./banner.ejs',data);
        }else{
            res.redirect('/admin/error?msg=????没有找到');
        }
        client.close();
    })
})
});
router.use('/add',require('./banner/add.js'))
router.use('/del',require('./banner/del.js'))
router.use('/change',require('./banner/change.js'))

module.exports = router;