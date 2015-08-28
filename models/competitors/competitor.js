var mongoose = require('mongoose')
var bcrypt = require('bcrypt')

var CompetitorSchema = mongoose.Schema({
  first_name: {
    type: String,
    required: true
  },
  last_name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  }
})

CompetitorSchema.method('comparePassword', function(_password, cb) {
  var competitor = this;
  bcrypt.compare(_password, competitor.password, function(err, isMatch) {
    if(err) return cb(err)
    cb(null, isMatch)
  })
})

module.exports = CompetitorSchema
