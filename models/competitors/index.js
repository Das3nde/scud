var mongoose = require('mongoose')
var competitor = require('./Competitor.js')

module.exports = mongoose.model('Competitor', competitor)
