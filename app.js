var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
//引入中间件
var cookieSession = require("cookie-session");
var bodyParser = require("body-parser");
var multer = require("multer");
//实例化
var app = express();

// ejs托管
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
//中间件配置
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(bodyParser());
app.use(cookieSession({
  name:"node_id",
  keys:["1","2"]
}))
let storage = multer.diskStorage({
  destination:function(req,file,cb){
      if(req.url.indexOf("product") !=-1){
      cb(null,path.join(__dirname,"public","upload","product"))
      }
      if(req.url.indexOf("user") !=-1){
        cb(null,path.join(__dirname,"public","upload","user"))
      }
      if(req.url.indexOf("banner") !=-1){
        cb(null,path.join(__dirname,"public","upload","banner"))
      }
  }
})
let upload = multer({storage});
app.use(upload.any());
//静态页面托管
app.use(express.static(path.join(__dirname, 'public','template')));//托管用户端
app.use('/admin',express.static(path.join(__dirname, 'public','admin')));//托管管理端，所以管理端的资源都要加上/admin
app.use(express.static(path.join(__dirname, 'public')));
//管理端响应
//不用守
app.use('/admin/login', require("./routes/admin/login.js"));
app.use('/admin/reg', require("./routes/admin/reg.js"));
app.use('/admin/logout', require("./routes/admin/logout.js"));//没用
app.use('/admin/success', require("./routes/admin/feedback/success.js"));
app.use('/admin/error', require("./routes/admin/feedback/error.js"));

app.all('/admin/*', require("./routes/admin/islogin.js"));//all第二个参数是个函数

app.use('/admin', require("./routes/admin/home.js"));
app.use('/admin/home', require("./routes/admin/home.js"));
app.use('/admin/product', require("./routes/admin/product.js"));
app.use('/admin/banner', require("./routes/admin/banner.js"));
app.use('/admin/user', require("./routes/admin/user.js"));



//用户端响应
app.all('/api/*',require('./routes/api/islogin.js'))
app.use('/api/product', require("./routes/api/product.js"));
app.use('/api/banner', require("./routes/api/banner.js"));
app.use('/api/detail', require("./routes/api/detail.js"));
// app.use('/api/login', require("./routes/api/login.js"));
// app.use('/api/logout', require("./routes/api/logout.js"));
// app.use('/api/reg', require("./routes/api/reg.js"));
// app.use('/api/user', require("./routes/api/user.js"));
// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  if(req.url.indexOf('/api') = !-1){
    // console.log('AAAAAAAAAAAAAAAAA',req.url.indexOf('/api'))
    res.send({err:1,msg:'错误的接口或请求方式'})
  }else{
    // console.log('AAAAAAAAAAAAAAAAA',req.url.indexOf('/api'))
    res.render('feedback/app_error');
  }
});

module.exports = app;
