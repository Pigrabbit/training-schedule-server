const express = require('express')
const user = require('../controllers/api/user')

const router = express.Router()

module.exports = function (passport) {
  router.post('/user', user.create)
  // router.get('/login', user.login)
  router.post('/login', (req, res, next) => {
    passport.authenticate('local', function (err, user, info) {
      if (err) {
        return next(err)
      }
      if (!user) {
        return res.send({ success: false })
      }

      req.logIn(user, function (err) {
        if (err) {
          return next(err)
        }
        return res.send({
          success: true,
          username: user.username
        })
      })
    })(req, res, next)
  })
  // router.post('/login_process', function (req, res, next) {
  //   passport.authenticate('local', function (err, user, info) {
  //     if (err) {
  //       return next(err)
  //     }
  //     if (!user) {
  //       return res.send({ success: false })
  //     }
  //
  //     req.logIn(user, function (err) {
  //       if (err) {
  //         return next(err)
  //       }
  //       return res.send({
  //         success: true,
  //         username: user.username
  //       })
  //     })
  //   })(req, res, next)
  // })
  //   router.post('/login_process',
  //   passport.authenticate('local', {
  //     successRedirect: '/',
  //     failureRedirect: '/login',
  //     failureFlash: true
  //   }))
  router.get('/logout', user.logout)

  return router
}
