var express = require('express')
var router = express.Router()
var mongoose = require('mongoose')
var Competitor = mongoose.model('Competitor')

router.get('/', function (req, res, next) {
  res.send('Test')
})

router.post('/signup', function (req, res) {
  console.log('signup')
  Competitor.findOne({email: req.body.email}, function (err, competitor) {
    console.log('returned from competitor')
    if (err) {
      res.status(500).send(err)
    } else if (competitor) {
      res.status(403).send({message: 'You already have an account, dummy!'})
    } else {
      console.log('creating competitor')
      Competitor.create(req.body, function (err, competitor) {
        console.log('db callback')
        if (err) {
          res.status(500).send(err)
        } else {
          res.redirect('/')
        }
      })
    }
  })
})

module.exports = router
