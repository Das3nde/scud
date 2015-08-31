var mongoose = require('mongoose')
var bcrypt = require('bcrypt')

var roles = [
  'competitor',
  'doshu',
  'admin'
]

var ranks = [
  'Jonokuchi',
  'Makuuchi',
  'Komosubi',
  'Sekiwake',
  'Ozeki',
  'Yokozuna'
]

var UserSchema = mongoose.Schema({
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
  },
  created: {
    type: Date,
    required: true,
    default: Date.now
  },
  stable: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Stable'
  },
  role: {
    type: String,
    required: true,
    enum: roles,
    default: 'competitor'
  },
  nards: {
    type: Number,
    required: true,
    default: 0
  },
  rank: {
    type: String,
    required: true,
    enum: ranks,
    default: 'Jonokuchi'
  }
})

UserSchema.method('comparePassword', function (_password, cb) {
  var user = this
  bcrypt.compare(_password, user.password, function (err, isMatch) {
    if (err) return cb(err)
    cb(null, isMatch)
  })
})

UserSchema.pre('save', function (next) {
  var user = this
  if (!this.isModified('password')) return next()
  bcrypt.hash(user.password, 5, function (err, hash) {
    if (err) return next(err)
    user.password = hash
    next()
  })
})

module.exports = UserSchema
