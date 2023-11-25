const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const db = require('./database');
const { validPassword } = require('../lib/passwordUtils');
const User = db.getUser()

const customFielfds = {
    usernameField: "uname",
    passwordField: "pw "
}

const verifyCallback = (username, password, done) =>
{
    User.findOne({ username: username }, function (err, user) {
        if (err) { return done(err); }

        if (!user) { return done(null, false); }

        const isValid = validPassword(password, User.hash, User.salt)
       // if (!user.verifyPassword(password)) { return done(null, false); }

       if(isValid)
       {
        return done(null, user);
       }
       else
       {
        return done (null, false)
       }
        
    }); 
}

const strategy = new LocalStrategy(customFielfds ,verifyCallback)

passport.use(strategy) 

passport.serializeUser((user,done) =>
{
    done(null, user.id)
})

passport.deserializeUser((userId, done) =>
{
    User.findById(userId)
    .then((user) => {done(null, user)})
    .catch((err) =>
    {
        done(err)
    })
})