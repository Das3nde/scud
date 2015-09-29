var express = require('express')
var router = express.Router()
var async = require('async')
var chalk = require('chalk')

var mongoose = require('mongoose')
var Games = mongoose.model('Game')
var Users = mongoose.model('User')

var makushita = ['Jonokuchi', 'Makushita']
var makuuchi = ['Komusubi', 'Sekiwake', 'Ozeki', 'Yokozuna']

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
  console.log(chalk.blue('Received a new game'))
  var game = req.body.game

  /*
   * Inflate the winner and the loser.
   * We can't trust the User to submit
   * valid data for these objects.
   */

  async.series({
    winner: function (callback) {
      console.log(chalk.yellow('Retrieving winning player'))
      Users
        .findOne({_id: game.winner})
        .populate('stable', 'name')
        .exec(callback)
    },
    loser: function (callback) {
      console.log(chalk.yellow('Retrieving losing player'))
      Users
        .findOne({_id: game.loser})
        .populate('stable', 'name')
        .exec(callback)
    }
  }, function (err, results) {
    if (err) return res.status(500).send(err)

    console.log(chalk.blue('Determining game outcome'))

    var winner = results.winner
    var loser = results.loser

    /*
     * Great! We have a winner and
     * a loser. Now we need to make
     * sure this game is valid!
     */

    function suitableRanks (rank1, rank2) {

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

    if (winner.stable.id === loser.stable.id) {

      console.log(chalk.green('Intra Stable Game; VALID'))

      /*
      * INTRA-Stable game is VALID
      */

      winner.nards++
    } else if (winner.nards < 5 || loser.nards < 5) {

      console.log(chalk.red('Inter Stable Game; INVALID nards'))

      /*
      * INTER-Stable game is INVALID. Players
      * must have nards >= 4
      */

      res.status(403).send(
        {
          message:
            'Invalid game - Inter-stable games can only be played ' +
            'between players with 5 or more stacks of the nards.'
        }
      )
      return
    } else if (!suitableRanks(winner.rank, loser.rank)) {

      console.log(chalk.red('Inter Stable Game; INVALID ranks'))

      /*
       * INTER-Stable game is INVALID. Players
       * must be of suitable rank to play one
       * another.
       */

      return res.status(403).send({
        message: 'Unsuitable Ranks: Players ranked as ' +
          winner.rank + ' ' +
          'cannot play players ranked as ' +
          loser.rank
      })
    } else {

      console.log(chalk.green('Inter Stable Game; VALID'))

      /*
       * INTER-Stable game is VALID.
       * Players have enough nards
       * and are of suitable rank
       */

      game.nards = ([
        'Full Clear',
        'Perfect SCUD',
        'Semi-perfect SCUD',
        'Shooting the Moon',
        'Running the Table',
        'Hara-kiri',
        'No Contest',
        'Cupping',
        'Matte'
      ].indexOf(game.victory_condition) > -1)

      game.nards_value = game.nards ? loser.nards : 1

      if (game.nards) {
        console.log(chalk.yellow('NARDS!'))
        winner.nards += loser.nards
        loser.nards = 0
      } else {
        loser.nards--
      }
    }

    calcRank({
      winner: winner,
      loser: loser,
      victory_condition: game.victory_condition,
      interstable: !(winner.stable.id === loser.stable.id)
    }, function (wRank, lRank) {
      console.log(chalk.blue('New ranks are:'))
      console.log(chalk.green('Winner '), wRank)
      console.log(chalk.red('Loser '), lRank)

      if (wRank === 'Komusubi') {
        winner.komusubi_counter++
      }

      if (lRank === 'Komusubi') {
        if (loser.rank === 'Komusubi') {
          loser.komusubi_counter++
        } else {
          loser.former_rank = loser.rank
          loser.komusubi_counter = 0
        }
      }

      winner.rank = wRank
      loser.rank = lRank

      game.interstable = !(winner.stable.id === loser.stable.id)
      Games.create(game, function (err, _game) {
        if (err) return res.status(500).send(err)
        async.series([
          function (callback) {
            winner.game_history.push(_game.id)
            winner.save(function (err, winner) {
              if (err) callback(err)
                else callback(null)
            })
          },
          function (callback) {
            loser.game_history.push(_game.id)
            loser.save(function (err, loser) {
              if (err) callback(err)
                else callback(null)
            })
          }
        ], function (err, results) {
          console.log(chalk.blue('Now returning results'))
          if (err) return res.status(500).send(err)
            else return res.sendStatus(200)
        })
      })
    })
  })
})

function calcRank (args, callback) {
  console.log(chalk.blue('Calculating rank changes...'))

  var _winner = args.winner
  var _loser = args.loser
  var _interstable = args.interstable
  var _victory_condition = args.victory_condition

  var wRank = _winner.rank
  var lRank = _loser.rank

  var special = [
    'Perfect SCUD',
    'Semi-perfect SCUD',
    'Shooting the Moon',
    'Running the Table',
    'Hara-kiri',
    'No Contest',
    'Cupping'
  ]

  var perfect = [
    'Perfect SCUD',
    'Shooting the Moon',
    'Running the Table'
  ]

  if (_interstable) {
    if (_winner.rank === 'Jonokuchi') {
      wRank = 'Makushita'
    }

    if (_loser.rank === 'Jonokuchi') {
      lRank = 'Makushita'
    }

    if (_victory_condition === 'Full Clear') {
      wRank = 'Yokozuna'
    }

    if (_winner.rank === 'Makushita' && special.indexOf(_victory_condition) > -1) {
      wRank = 'Sekiwake'
    }

    if (_winner.rank === 'Sekiwake' && perfect.indexOf(_victory_condition) > -1) {
      wRank = 'Ozeki'
    }

    if (_winner.rank === 'Ozeki' && perfect.indexOf(_victory_condition) > -1) {
      wRank = 'Yokozuna'
    }

    if (_loser.nards === 0 && makuuchi.indexOf(_loser.rank) > -1) {
      lRank = 'Komusubi'
    }
  } else {
    if (_winner.rank === 'Komusubi') {
      if (_winner.nards > 4) {
        console.log(chalk.green('Promoting Komusubi back to former rank'))
        wRank = _winner.former_rank
      } else if (_winner.komusubi_counter > 8) {
        wRank = 'Makushita'
      }
    }

    if (_loser.rank === 'Komusubi' && _loser.komusubi_counter > 9) {
      lRank = 'Makushita'
    }
  }

  callback(wRank, lRank)
}

module.exports = router
