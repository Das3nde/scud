var mongoose = require('mongoose')
var game = require('./Game.js')

module.exports = mongoose.model('Game', game)
