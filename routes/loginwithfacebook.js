var LocalStrategy    = require('passport-local').Strategy;
var FacebookStrategy = require('passport-facebook').Strategy;
var passport=require('passport');
var Router=require('express').Router();
// load up the user model
var User     = require('../mongoose/models/facebook');

// load the auth variables
var configAuth = require('../configure/config').facebook;


    // used to serialize the user for the session
    passport.serializeUser(function(user, done) {
        done(null, user.id);
    });

    // used to deserialize the user
    passport.deserializeUser(function(id, done) {
        User.findById(id, function(err, user) {
            done(err, user);
        });
    });

    // code for login (use('local-login', new LocalStategy))
    // code for signup (use('local-signup', new LocalStategy))

    // =========================================================================
    // FACEBOOK ================================================================
    // =========================================================================
    passport.use(new FacebookStrategy({

            // pull in our app id and secret from our auth.js file
            clientID        : configAuth.facebookAuth.clientID,
            clientSecret    : configAuth.facebookAuth.clientSecret,
            callbackURL     : configAuth.facebookAuth.callbackURL

        },

        // facebook will send back the token and profile
        function(token, refreshToken, profile, done) {

            // asynchronous
            process.nextTick(function() {

                // find the user in the database based on their facebook id
                User.findOne({ 'id' : profile.id }, function(err, user) {

                    // if there is an error, stop everything and return that
                    // ie an error connecting to the database
                    if (err)
                        return done(err);

                    // if the user is found, then log them in
                    if (user) {
                        console.log(user)
                        return done(null, user); // user found, return that user
                    } else {
                        // if there is no user found with that facebook id, create them
                        var newUser= new User();
                        // set all of the facebook information in our user model
                        newUser.id   = profile.id; // set the users facebook id
                        newUser.token = token; // we will save the token that facebook provides to the user
                        newUser.name  = profile.name.givenName + ' ' + profile.name.familyName; // look at the passport user profile to see how names are returned
                        newUser.email = profile.emails?profile.emails[0].value:'undefined';
                        // facebook can return multiple emails so we'll take the first
                        newUser.displayName=profile.displayName;
                        // save our user to the database
                        newUser.save(function(err) {
                            if (err)
                                throw err;
                            // if successful, return the new user
                            console.log(newUser)
                            return done(null,newUser);
                        });
                    }

                });
            });

        }));
Router.get('/facebook', passport.authenticate('facebook', {
    scope : ['public_profile', 'email']
}));

// handle the callback after facebook has authenticated the user
Router.get('/facebook/callback', passport.authenticate('facebook', { failureRedirect: '/login' }),
    function(req, res) {
        // Successful authentication, redirect home
        res.redirect('/');
    });
module.exports=Router;