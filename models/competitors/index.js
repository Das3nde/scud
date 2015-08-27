var mongoose = require('mongoose')
var competitor = require('./competitor.js')

module.exports = mongoose.model('Competitor', competitor)
