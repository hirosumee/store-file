var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var passport=require('passport');
var session=require('express-session');
var mongoose=require('mongoose');

var index = require('./routes/index');
var users = require('./routes/users');
var userConfig=require('./config/user-config');
//

mongoose.connect("mongodb://hirosume:cuong299@ds042688.mlab.com:42688/gin-file",{ useMongoClient:true},function(err){
    if(err){
        console.log('Can not connect to mongodb',err);
    }else {
        console.log('connected to mongodb');
    }
});
var app = express();
app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

//use middleware autheticate
app.use(session({
    secret:'secret',
    saveUninitialized:true,
    resave:true
}));

app.use(passport.initialize());
app.use(passport.session());
app.use(function (req,res,next) {
    res.uploadRange=userConfig.user.max_size;
    if(req.user&&req.user.position==='admin')
    {
        res.uploadRange=userConfig.admin.max_size;
    }
    next();
});
app.use('/', index);
app.use('/', users);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  res.redirect('/');
  next();
});
// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);

    if(err.code=='LIMIT_FILE_SIZE'){
        // catch over file size limit
        res.redirect('/');
    }
    else
    {
        res.render('error');
    }

});

module.exports = app;
