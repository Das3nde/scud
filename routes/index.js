var express = require('express')
var router = express.Router()

router.use('/api', require('./api'))

router.use('/login', function (req, res) {
  res.render('login', {title: 'SCUD Registry Login'})
})

router.use('/signup', function (req, res) {
  res.render('signup', {title: 'SCUD Registry Signup'})
})

router.use(function (req, res) {
  res.render('index', {title: 'SCUD Registry'})
})

module.exports = router
