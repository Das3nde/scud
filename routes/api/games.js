var express = require('express')
var router = express.Router()
var async = require('async')

var mongoose = require('mongoose')
var Games = mongoose.model('Game')
var Users = mongoose.model('User')

/*
router.param('stable', function (req, res, next, id) {
  Stable.findOne({_id: id})
    .exec()
    .then(function (stable) {
      req.stable = stable
      next()
    }, next)
})
*/

router.get('/', function (req, res, next) {
  Games.find()
    .exec()
    .then(function (games) {
      return res.json(games)
    }, next)
})

router.post('/', function (req, res) {
  var game = req.body.game

  var getWinner = function (callback) {
    Users
      .findOne({_id: game.winner})
      .populate('stable', 'name')
      .exec(function (err, winner) {
        callback(null, winner)
      })
  }

  var getLoser = function (callback) {
    Users
      .findOne({_id: game.loser})
      .populate('stable', 'name')
      .exec(function (err, loser) {
        callback(null, loser)
      })
  }

  async.series({
    winner: getWinner,
    loser: getLoser
  }, function(err, results) {
    var winner = results.winner
    var loser = results.loser

    if (winner.stable.id === loser.stable.id) {
      winner.nards++
      winner.save(function (err) {
        if (err) throw err
        else res.sendStatus(202)
      })
    } else {

      if (winner.nards < 6 || loser.nards < 6) {
        console.log('INVALID GAME!!!!')
        res.sendStatus(403)
      } else {
        var makushita = ['Jonokuchi', 'Makushita']
        var makuuchi = ['Komusubi', 'Sekiwake', 'Ozeki', 'Yokozuna']

        var gameValidator = {
          Jonokuchi: makushita,
          Makushita: makushita,
          Komosubi: makuuchi,
          Sekiwake: makuuchi,
          Ozeki: makuuchi,
          Yokozuna: makuuchi
        }
        if (gameValidator[winner.rank].indexOf(loser.rank) !== -1) {
          console.log('Game is valid')
        }
        var nards = ([
          'Full Clear',
          'Perfect SCUD',
          'Semi-perfect SCUD',
          'Shooting the Moon',
          'Running the Table',
          'Hara-kiri',
          'No Contest',
          'Cupping',
          'Matte'
        ].indexOf(game.victory_condition) !== -1)
        console.log(nards)

        res.sendStatus(200)
      }
    }
  })


  // Get Winner from DB
  // Get Loser from DB
  // 
  // Create Game Last

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
