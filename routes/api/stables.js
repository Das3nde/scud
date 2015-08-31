var express = require('express')
var router = express.Router()
var mongoose = require('mongoose')
var Stable = mongoose.model('Stable')

router.param('stable', function (req, res, next, id) {
  Stable.findOne({_id: id})
    .exec()
    .then(function (stable) {
      req.stable = stable
      next()
    }, next)
})

router.get('/', function (req, res, next) {
  Stable.find()
    .exec()
    .then(function (stables) {
      return res.json(stables)
    }, next)
})

router.post('/', function (req, res) {
  Stable.findOne({name: req.body.name}, function (err, stable) {
    if (err) {
      res.status(500).send(err)
    } else if (stable) {
      res.status(403).send('This stable already exists!')
    } else {
      Stable.create({
        name: req.body.name,
        doshu: req.user._id
      }, function (err, stable) {
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
