module.exports = function (app) {
  const User = require('../models/user')

  const passport = require('passport'),
    LocalStrategy = require('passport-local').Strategy

  app.use(passport.initialize())
  app.use(passport.session())

  passport.serializeUser(function (user, done) {
    done(null, user.email)
  })

  passport.deserializeUser(function (id, done) {
    User.findOne({ email: id }, function (error, user) {
      done(error, user)
    })
  })

  passport.use(new LocalStrategy(
    {
      usernameField: 'email',
      passwordField: 'password'
    },
    function (username, password, done) {
      User.findOne({ email: username }, function (error, user) {
        if (error) {
          return done(error)
        }
        if (!user) {
          return done(null, false, {message: 'Incorrect username.'})
        }
        if (user.password !== password) {
          return done(null, false, {message: 'Incorrect password.'})
        }
        return done(null, user)
      })
    }
  ))
  return passport
}
