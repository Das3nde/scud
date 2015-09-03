var express = require('express')
var router = express.Router()
var passport = require('passport')

var mongoose = require('mongoose')
var Stable = mongoose.model('Stable')
var User = mongoose.model('User')

router.use('/api', passport.isLoggedIn, require('./api'))
router.use('/', require('./auth'))

router.get('/create-stable', function (req, res) {
  res.render('create_stable')
})

router.post('/join-stable', function (req, res) {
  console.log(req.body.stable)
  Stable.findOne({_id: req.body.stable})
    .then(function (stable) {
      User.findOne({_id: req.user.id})
        .then(function (user) {
          user.stable = stable._id
          user.save(function (err) {
            if (err) {
              console.log(err)
              res.sendStatus(500)
            } else {
              res.sendStatus(200)
            }
          })
        })
    })
})

router.use('/', function (req, res) {
  res.render('index', {title: 'SCUD Registry'})
})

module.exports = router
