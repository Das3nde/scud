var express = require('express')
var router = express.Router()
var mongoose = require('mongoose')
var passport = require('passport')

var User = mongoose.model('User')

router.use('/api', passport.isLoggedIn, require('./api'))

router.post('/login', function (req, res) {
  User.findOne({email: req.body.email}, function (err, user) {
    if (err) {
      res.status(500).send(err)
    } else if (!user) {
      res.status(403).send({message: 'Sorry, we could not find your account!'})
    } else {
      user.comparePassword(req.body.password, function (err, isValid) {
        if (err) {
          res.status(500).send(err)
        } else if (isValid) {
          req.login(user, function (err) {
            if (err) {
              res.status(500).send(err)
            } else {
              res.redirect('/')
            }
          })
        } else {
          res.status(403).send({message: 'Invalid password'})
        }
      })
    }
  })
})

router.get('/logout', function (req, res) {
  req.logout()
  res.redirect('/login')
})

router.get('/signup', function (req, res) {
  res.render('signup', {title: 'SCUD Registry Signup'})
})

router.get('/create-stable', function (req, res) {
  res.render('create_stable')
})

router.use('/', function (req, res) {
  res.render('index', {title: 'SCUD Registry'})
})

module.exports = router
