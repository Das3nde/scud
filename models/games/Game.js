var mongoose = require('mongoose')

var GameSchema = mongoose.Schema({
  created: {
    type: Date,
    required: true,
    default: Date.now
  },
  winner: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User'
  },
  loser: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User'
  },
  victory_condition: {
    type: String,
    required: true
  },
  interstable: {
    type: Boolean,
    required: true,
    default: false
  },
  nards: {
    type: Boolean,
    required: true,
    default: false
  },
  nards_value: {
    type: Number,
    required: false,
    default: 1
  }
})

GameSchema.pre('save', function (next) {
  console.log(this.winner)
  next()
})

module.exports = GameSchema
