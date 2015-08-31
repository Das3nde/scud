if (!process.env.NODE_ENV || process.env.NODE_ENV === 'development') {
  require('dotenv').load()
}
var MONGO_SERVER = process.env.MONGO_URI
var mongoose = require('mongoose')
mongoose.connect(MONGO_SERVER)
require('./models')

var Stable = mongoose.model('Stable')

var name = process.argv[2]

Stable.create({name: name}, function (err, stable) {
  if (err) throw err
  console.log(stable.name)
  process.exit()
})
