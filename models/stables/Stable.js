var mongoose = require('mongoose')

var StableSchema = mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  created: {
    type: Date,
    required: true,
    default: Date.now
  },
  doshu: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  rikishi: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    }
  ],
  pending: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    }
  ]
})

module.exports = StableSchema
