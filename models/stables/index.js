var mongoose = require('mongoose')
var stable = require('./Stable.js')

module.exports = mongoose.model('Stable', stable)
