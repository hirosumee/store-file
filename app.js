var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session=require('express-session');
var passport=require('passport');
var mongoose=require('mongoose');
var os=require('os')
const requestIp = require('request-ip');

let index = require('./routes/index');
let users = require('./routes/users');
let configure=require('./configure/config');
let registry=require('./routes/registry');
let login=require('./routes/login');
let facebookAutho=require('./routes/loginwithfacebook');
let profile=require('./routes/profile');
let files=require('./routes/file');
let admin=require('./routes/admin');
let loadconfig=require('./mongoose/models/config');
 express.adminconfig={
    download:true,
    upload:true,
    limitup:true,
    limitdown:true,
    uplength:100*1024*1024,
    downlength:100*1024*1024
}
loadconfig.load()
    .then(function (data) {
        express.adminconfig=data;
    })
mongoose.connect(configure.server.keyDb,{useMongoClient:true},function (err) {
    if(err)
    {
        console.error('cant connect to database with error',err);
    }
    else
    {
        console.log('connected to database');
    }
});

var app = express();

//setup passport
app.use(session({
    secret:"secret",
    saveUninitialized: true,
    resave: true
}));
app.use(passport.initialize());
app.use(passport.session());
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
app.use(requestIp.mw());

app.use(function (req,res,next) {
    if(os.freemem()>=os.totalmem()*0.9)
    {
        res.send('server is busy ,please wait one time');
    }
    else
    {
        req.adminconfig=express.adminconfig;
        next();
    }
})
app.use('/', index);
app.use('/users', users);
app.use('/',registry);
app.use('/login',login);
app.use('/auth',facebookAutho);
app.use('/profile',profile);
app.use('/file',files);
app.use('/admin',admin);
// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});
// console.log(process.memoryUsage());
module.exports = app;
