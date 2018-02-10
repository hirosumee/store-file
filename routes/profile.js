var Route=require('express').Router();
var FILE=require('../mongoose/models/file');
Route.get('/',function (req,res) {
    if(req.isAuthenticated())
    {
        FILE.GetallOwner(req.user.username)
            .then(function (doc) {
                console.log(doc);
                res.render('profile',{data:doc});
            })
    }
    else
    {
        res.redirect('/');
    }
})
module.exports=Route;