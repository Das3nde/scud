var mongoose = require('mongoose')

var StableSchema = mongoose.Schema({
  name: {
    type: String,
    require: true
  }
})

module.exports = StableSchema

// Admin
// Members
