var passport = require('passport')
var express = require('express')
var router = express.Router()

router.use('/api', require('./api'))

router.get('/login', function (req, res) {
  res.render('login', {title: 'SCUD Registry Login'})
})

router.get('/signup', function (req, res) {
  res.render('signup', {title: 'SCUD Registry Signup'})
})

router.get('/create-stable', function (req, res) {
  res.render('create_stable')
})

router.use('/', passport.isLoggedIn, function (req, res) {
  res.render('index', {title: 'SCUD Registry'})
})

module.exports = router
