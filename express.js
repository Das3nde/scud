function createApp () {
  var chalk = require('chalk')
  var express = require('express')
  var path = require('path')
  // var favicon = require('serve-favicon')
  var logger = require('morgan')
  var cookieParser = require('cookie-parser')
  var cookieSession = require('cookie-session')
  var bodyParser = require('body-parser')
  var passport = require('passport')

  /*
  var mailgun = require('mailgun-js')({
    apiKey: process.env.MAILGUN_API_KEY,
    domain: process.env.MAILGUN_DOMAIN_NAME
  })

  mailgun.messages().send({
    from: 'Test <test@samples.mailgun.org>',
    to: 'justin@elevenjames.com',
    subject: 'Test',
    text: 'Testing Mailgun'
  }, function (err, body) {
    if (err) console.log('Error sending email', err)
      else console.log('Email ID', body.id)
  })
  */

  /*
   * MongoDB and Mongoose Configuration
   */

  var MONGO_SERVER = process.env.MONGO_URI
  if (!MONGO_SERVER) {
    throw new Error(chalk.red('Please specify MONGO_URI in .env file'))
  }

  var mongoose = require('mongoose')
  mongoose.connect(MONGO_SERVER)

  /*
   * MongoDB Sessions
   */

  var session = require('express-session')
  var MongoDBStore = require('connect-mongodb-session')(session)

  var store = new MongoDBStore({
    uri: MONGO_SERVER,
    collection: 'sessions'
  })

  var app = express()

  // view engine setup
  app.set('views', path.join(__dirname, 'views'))
  app.set('view engine', 'jade')

  // uncomment after placing your favicon in /public
  // app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
  app.use(logger('dev'))
  app.use(bodyParser.json({uploadDir: './temp'}))
  app.use(bodyParser.urlencoded({ extended: true }))
  app.use(cookieParser())
  app.use(cookieSession({
    keys: ['key1', 'key2']
  }))
  app.use(session({
    resave: true,
    saveUninitialized: true,
    secret: 'Pkdj3Hkd4',
    store: store
  }))
  app.use(passport.initialize())
  app.use(passport.session())
  app.use(express.static(path.join(__dirname, 'public')))

  require('./models')
  require('./config')
  app.use('/', require('./routes'))

  // catch 404 and forward to error handler
  app.use(function (req, res, next) {
    var err = new Error('Not Found')
    err.status = 404
    next(err)
  })

  // error handlers

  // development error handler
  // will print stacktrace
  if (app.get('env') === 'development') {
    app.use(function (err, req, res, next) {
      res.status(err.status || 500)
      res.render('error', {
        message: err.message,
        error: err
      })
    })
  }

  // production error handler
  // no stacktraces leaked to user
  app.use(function (err, req, res, next) {
    res.status(err.status || 500)
    res.render('error', {
      message: err.message,
      error: {}
    })
  })

  app.set('port', process.env.PORT || 8080)
  return app
}

module.exports = createApp
