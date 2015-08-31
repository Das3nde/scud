var mongoose = require('mongoose')
var user = require('./User.js')

module.exports = mongoose.model('User', user)
