const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const db = require('./database');
const { validPassword } = require('../lib/passwordUtils');
//const User = db.getUser()


const verifyCallback = (username, password, done) => {

    const User = db.getUserByUsername(username)

    
        .then(
            (user) => {
                console.log(user)

                const isValid = validPassword(password, user.hash, user.salt)
                // if (!user.verifyPassword(password)) { return done(null, false); }

                if (isValid) {
                    return done(null, user);
                }
                else {
                    return done(null, false)
                }
            }
        )

        .catch((error) => {
            if (error) { return done(error); }
           console.log(error)
           return done(null, false);
            
        })

}

const strategy = new LocalStrategy(verifyCallback)

passport.use(strategy)

passport.serializeUser((user, done) => {
    done(null, user.username)
})

passport.deserializeUser((username, done) => {
    // User.findById(userId)
    db.getUserByUsername(username)
        .then((user) => { done(null, user) })
        .catch((err) => {
            done(err)
        })
})