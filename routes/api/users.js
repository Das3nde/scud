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

router.get('/', function (req, res, next) {
  res.send('Test')
})

router.get('/:user', function (req, res) {
  res.json(req.user)
})

router.post('/signup', function (req, res) {
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

module.exports = router
