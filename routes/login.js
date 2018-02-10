var LocalStrategy=require('passport-local').Strategy;
var passport=require('passport');
var express=require('express');
var bcrypt = require('bcrypt');
var user=require('../mongoose/models/user');
var Router=express.Router();
passport.serializeUser(function (user,done){
    done(null,user._id);
});
passport.deserializeUser(function (id,done) {
    user.findbyId(id)
        .then(function (doc) {
        done(null,doc);
        })
        .catch(function (err) {
            console.error('Authorticate spawn a error',err);
        })
})
passport.use(new LocalStrategy(function (username,password,done) {
    user.findUserbyName(username)
        .then(function (docs) {
            if(docs.length>=0)
            {
                bcrypt.compare(password,docs[0].password)
                    .then(function (res) {
                        if(res)
                        {
                            return done(null, docs[0]);
                        }
                        else
                        {
                            return done(null, false, { message: 'Incorrect username and password' });
                        }
                    })
                    .catch(function (err) {
                        return done(err);
                    })
            }
        })
}))
Router.post('/',passport.authenticate('local'),function (req,res) {
    console.log(req.body)
    res.send({result:"success"})
   // res.redirect()
})
module.exports=Router;