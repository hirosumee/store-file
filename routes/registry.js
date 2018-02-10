var express=require('express');
var router=express.Router();
var user=require('../mongoose/models/user');
router.post('/registry',function (req,res) {
    user.create(req.body.username,req.body.password)
        .then(function (msg) {
            console.log(msg);
            res.send(msg);
        })
        .catch(function (msg) {
            console.log(msg);
            res.send(msg);
        })
})
module.exports=router;