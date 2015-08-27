var mongoose = require('mongoose')

var CompetitorSchema = mongoose.Schema({
  first_name: {
    type: String,
    required: true
  },
  last_name: {
    type: String,
    required: true
  }
})

module.exports = CompetitorSchema
