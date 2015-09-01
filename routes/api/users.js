var express = require('express')
var router = express.Router()
var mongoose = require('mongoose')
var User = mongoose.model('User')

router.param('user', function (req, res, next, id) {
  User.findOne({_id: id})
    .exec()
    .then(function (user) {
      req.user = user
      next()
    }, next)
})

router.get('/', function (req, res) {
  User.find({})
    .exec()
    .then(function (users) {
      res.json(users)
    })
})

router.post('/', function (req, res) {
  console.log('signup')
  User.findOne({email: req.body.email}, function (err, user) {
    if (err) {
      res.status(500).send(err)
    } else if (user) {
      res.status(403).send('You already have an account, dummy!')
    } else {
      User.create(req.body, function (err, user) {
        if (err) {
          res.status(500).send(err)
        } else {
          req.login(user, function (err) {
            if (err) {
              res.status(500).send(err)
            } else {
              res.redirect('/')
            }
          })
        }
      })
    }
  })
})

module.exports = router
