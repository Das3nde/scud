var mongoose = require('mongoose')
var Competitor = mongoose.model('Competitor')
var passport = require('passport')

passport.serializeUser(function (competitor, done) {
  done(null, competitor.id)
})

passport.deserializeUser(function (id, done) {
  Competitor.findById(id, function (err, competitor) {
    done(err, competitor)
  })
})

passport.isLoggedIn = function (req, res, next) {
  if (req.isAuthenticated()) {
    return next()
  }

  res.sendStatus(401)
}
