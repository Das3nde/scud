var express = require('express')
var router = express.Router()
var passport = require('passport')

router.use('/api', passport.isLoggedIn, require('./api'))
router.use('/', require('./auth'))

router.get('/create-stable', function (req, res) {
  res.render('create_stable')
})

router.post('/join-stable', function (req, res) {
  // req.user.id
  // req.body.stable
  //
  // find req.body.stable
  //
  // push req.user.id -> stable.pending
  //
  // User could already be pending?
  //
})

router.use('/', function (req, res) {
  res.render('index', {title: 'SCUD Registry'})
})

module.exports = router
