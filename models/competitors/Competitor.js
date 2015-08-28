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

CompetitorSchema.method('comparePassword', function (_password, cb) {
  var competitor = this
  bcrypt.compare(_password, competitor.password, function (err, isMatch) {
    if (err) return cb(err)
    cb(null, isMatch)
  })
})

CompetitorSchema.pre('save', function (next) {
  var competitor = this
  if (!this.isModified('password')) return next()
  bcrypt.hash(competitor.password, 5, function (err, hash) {
    if (err) return next(err)
    competitor.password = hash
    next()
  })
})

module.exports = CompetitorSchema
