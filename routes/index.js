var express = require('express');
var FILE=require('../mongoose/models/file');
var router = express.Router();


/* GET home page. */
router.get('/', function(req, res, next) {
    FILE.Getallpublic()
        .then(function (docs) {
            res.render('index', { islogin:req.user?true:false,data:docs });
        })
});
router.get('/logout',function (req,res) {
    req.logout();
    res.redirect('/');
})
module.exports = router;
