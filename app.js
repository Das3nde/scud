var throng = require('throng')

if (!process.env.NODE_ENV || process.env.NODE_ENV === 'development') {
  require('dotenv').load()
}

function start () {
  var createApp = require('./express')
  var app = createApp()
  app.listen(app.get('port'), function () {
    console.log('Express server listening on port ' + app.get('port'))
  })
}

var WORKERS = process.env.WEB_CONCURRENCY || 1

throng(start, {
  workers: WORKERS,
  lifetime: Infinity
})
