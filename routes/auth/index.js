var express = require('express')
var router = express.Router()

var chalk = require('chalk')
var jade = require('jade')

var mongoose = require('mongoose')
var User = mongoose.model('User')

router.post('/login', function (req, res) {
  console.log(chalk.blue('New login request from'), req.body.email)
  User
  .findOne({email: req.body.email})
  .select('password first_name last_name email role')
  .exec(function (err, user) {
    if (err) {
      console.log(chalk.red('Fatal Mongoose error while finding user'), req.body.email)
      return res.status(500).send(err)
    } else if (!user) {
      console.log(chalk.red('Could not find user account'), req.body.email)
      return res.status(403).send({
        message: 'Sorry, we could not find your account!'
      })
    } else if (user.role === 'Pending') {
      console.log(chalk.red('User has not been approved:'), req.body.email)
      return res.status(403).send({
        message: 'Your account has not been activated yet'
      })
    } else {
      user.comparePassword(req.body.password, function (err, isValid) {
        if (err) {
          console.log(chalk.red('Error comparing password for user'), user.email)
          return res.status(500).send(err)
        } else if (isValid) {
          console.log(chalk.green('PW validation successful for user'), user.email)
          req.login(user, function (err) {
            if (err) {
              console.log(chalk.red('Fatal error logging in user'), user.email)
              return res.status(500).send(err)
            } else {
              console.log(
                chalk.blue('User log in successful for'), user.first_name, user.last_name)
              return res.sendStatus(200)
            }
          })
        } else {
          console.log(chalk.red('Invalid password for user'), user.email)
          res.status(403).send({message: 'Invalid password'})
        }
      })
    }
  })
})

router.get('/logout', function (req, res) {
  req.logout()
  return res.redirect('/login')
})

router.post('/signup', function (req, res) {
  console.log(chalk.blue('Signing up user'), req.body.email)
  User.findOne({email: req.body.email}, function (err, user) {
    if (err) {
      console.log(chalk.red('Fatal error finding user'), req.body.email)
      return res.status(500).send(err)
    } else if (user) {
      console.log(chalk.yellow('This account already exists!'), req.body.email)
      return res.status(403).send({message: 'You already have an account, dummy!'})
    } else {
      console.log(chalk.yellow('Now creating user'), req.body.email)
      User.create({
        first_name: req.body.first_name,
        last_name: req.body.last_name,
        email: req.body.email,
        password: req.body.password,
        role: 'Pending'
      }, function (err, user) {
        if (err) {
          console.log(chalk.red('Fatal error creating user'), req.body.email)
          return res.status(500).send(err)
        } else {
          console.log(chalk.blue('Now attempting to email new user'), user.email)

          var mailgun = require('mailgun-js')({
            apiKey: process.env.MAILGUN_API_KEY,
            domain: process.env.MAILGUN_DOMAIN_NAME
          })

          var html = jade.renderFile('./emails/confirmation.jade', {
            name: user.first_name + ' ' + user.last_name,
            confirmurl: 'http://' + req.get('host') + '/confirm/' + user.id
          })

          mailgun.messages().send({
            from: 'Test <test@samples.mailgun.org>',
            to: user.email,
            bcc: 'knutson.justin@gmail.com',
            subject: 'Confirm SCUD Registry Account',
            html: html
          }, function (err, body) {
            if (err) {
              console.log('Error sending email', err)
              return res.status(500).send(err)
            } else {
              console.log(chalk.blue('Confirmation Email ID:'), body.id)
            }
          })
          return res.sendStatus(200)
        }
      })
    }
  })
})

router.get('/confirm/:id', function (req, res) {
  console.log(chalk.blue('Confirming user with id'), req.params.id)
  User.findOne({_id: req.params.id}, function (err, user) {
    if (err) return res.status(500).send(err)
    else if (user && user.role === 'Pending') {
      user.role = 'Competitor'
      user.save(function (err) {
        console.log(chalk.blue('User saved as...'), user.role)
        if (err) {
          return res.status(500).send(err)
        } else {
          req.login(user, function (err) {
            if (err) return res.status(500).send(err)
            else return res.redirect('/')
          })
        }
      })
    } else {
      return res.redirect('/login')
    }
  })
})

router.get('/user', function (req, res) {
  res.json(req.user)
})

module.exports = router
