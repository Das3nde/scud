var mongoose = require('mongoose')

var GameSchema = mongoose.Schema({
  created: {
    type: Date,
    required: true,
    default: Date.now
  },
  winner: {
    type: mongoose.Schema.Types.ObjectId,
    required: true
  },
  loser: {
    type: mongoose.Schema.Types.ObjectId,
    required: true
  },
  nards: {
    type: Boolean,
    required: true,
    default: false
  },
  interstable: {
    type: Boolean,
    required: true,
    default: false
  }
})

module.exports = GameSchema
