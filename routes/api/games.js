var express = require('express')
var router = express.Router()

var mongoose = require('mongoose')
//var Game = mongoose.model('Game')

/*
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
    .populate('doshu', 'first_name last_name')
    .exec()
    .then(function (stables) {
      return res.json(stables)
    }, next)
})
*/

router.post('/', function (req, res) {
  res.sendStatus(202)
  /*
  Game.create({
    name: req.body.name,
    doshu: req.user._id
  }, function (err, stable) {
    if (err) {
      res.status(500).send(err)
    } else {
      res.redirect('/')
    }
  })
 */
})

module.exports = router