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
  }, function (err, results) {

    var winner = results.winner
    var loser = results.loser

    if (winner.stable.id === loser.stable.id) {

      /*
      * INTRA-Stable game is VALID
      */

      winner.nards++
      winner.save(function (err) {
        // @TODO Handle error
        if (err) throw err
        else return res.sendStatus(202)
      })
    } else if (winner.nards < 6 || loser.nards < 6 || !suitableRanks(winner.rank, loser.rank)) {

      /*
      * INTER-Stable game is INVALID. Players
      * must have nards > 6 and be of suitable
      * Rank to compete with one another.
      */

      // @TODO Pass Error to Front End
      console.log('INVALID GAME!!!!')
      return res.sendStatus(403)
    } else {

      /*
       * INTER-Stable game is VALID.
       * Players have enough nards
       * and are of suitable rank
       */

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

      if (nards) {
        // @TODO Winner Takes Loser's Nards
        res.sendStatus(200)
      } else {
        // @TODO Loser losers 1 Nards
        res.sendStatus(200)
      }
    }

    function suitableRanks (rank1, rank2) {
      var makushita = ['Jonokuchi', 'Makushita']
      var makuuchi = ['Komusubi', 'Sekiwake', 'Ozeki', 'Yokozuna']

      var validator = {
        Jonokuchi: makushita,
        Makushita: makushita,
        Komosubi: makuuchi,
        Sekiwake: makuuchi,
        Ozeki: makuuchi,
        Yokozuna: makuuchi
      }
      return validator[rank1].indexOf(rank2) > -1     
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
