var express = require('express')
var router = express.Router()
var mongoose = require('mongoose')
var passport = require('passport')

var User = mongoose.model('User')

router.use('/api', passport.isLoggedIn, require('./api'))

router.get('/user', function (req, res) {
  res.json(req.user)
})

router.post('/login', function (req, res) {
  User.findOne({email: req.body.email})
    .select('password')
    .exec(function (err, user) {
      if (err) {
        res.status(500).send(err)
      } else if (!user || user.role === 'Pending') {
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

router.post('/signup', function (req, res) {
  User.findOne({email: req.body.email}, function (err, user) {
    if (err) {
      res.status(500).send(err)
    } else if (user) {
      res.status(403).send('You already have an account, dummy!')
    } else {
      User.create({
        first_name: req.body.first_name,
        last_name: req.body.last_name,
        email: req.body.email,
        password: req.body.password,
        role: 'Pending'
      }, function (err, user) {
        if (err) {
          res.status(500).send(err)
        } else {
          var mailgun = require('mailgun-js')({
            apiKey: process.env.MAILGUN_API_KEY,
            domain: process.env.MAILGUN_DOMAIN_NAME
          })
          console.log('Sending Email')
          mailgun.messages().send({
            from: 'Test <test@samples.mailgun.org>',
            to: user.email,
            subject: 'Confirm Account',
            text: 'Please use ID: ' + user._id
          }, function (err, body) {
            if (err) console.log('Error sending email', err)
              else console.log('Email ID:', body.id)
          })
          res.send('You should receive a confirmation email shortly!')
        }
      })
    }
  })
})

router.get('/confirm/:id', function (req, res) {
  console.log('Confirming id: ', req.params.id)
  User.findOne({_id: req.params.id}, function (err, user) {
    if (err) res.status(500).send(err)
    else if (user && user.role === 'Pending') {
      user.role = 'Competitor'
      user.save(function (err) {
        console.log('User saved as...', user.role)
        if (err) {
          res.status(500).send(err)
        } else {
          req.login(user, function (err) {
            if (err) res.status(500).send(err)
            else res.redirect('/')
          })
        }
      })
    } else {
      res.redirect('/login')
    }
  })
})

router.get('/create-stable', function (req, res) {
  res.render('create_stable')
})

router.use('/', function (req, res) {
  res.render('index', {title: 'SCUD Registry'})
})

module.exports = router
