var mongoose = require('mongoose')
var User = mongoose.model('User')
var passport = require('passport')

passport.serializeUser(function (user, done) {
  done(null, user.id)
})

passport.deserializeUser(function (id, done) {
  User.findById(id, function (err, user) {
    done(err, user)
  })
})

passport.isLoggedIn = function (req, res, next) {
  if (req.isAuthenticated()) {
    return next()
  }

  res.sendStatus(401)
}
