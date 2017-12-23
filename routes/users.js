var express = require('express');
var router = express.Router();
var LocalStrategy = require('passport-local').Strategy;
var passport = require('passport');
var db=require('../models/user');
// var bcrypt = require('bcrypt');

passport.serializeUser(function(user, done) {
    done(null, user.id);
});

passport.deserializeUser(function(id, done) {
    db.FindById(id).then(function (user) {
        done(null, user);
    }).catch(function (err) {
        console.log(err);
    })
});

passport.use(new LocalStrategy(
    function (username,password,done) {
        db.Compare({username:username,password:password})
            .then(function (req) {
                return done(null,req);
            })
            .catch(function (err) {
                console.log(err)
                return done(null,false);
            })
    }
));
router.post("/login",passport.authenticate('local',{successRedirect:'/',failureRedirect:'/login'}));

module.exports = router;
