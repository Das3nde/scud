'use strict'

var browserSync = require('browser-sync').create()
var chalk = require('chalk')
var gulp = require('gulp')

var $ = require('gulp-load-plugins')()

if (!process.env.NODE_ENV || process.env.NODE_ENV === 'development') {
  require('dotenv').load()
}

var config = {
  serverConfig: {}
}

gulp.task('nodemon', function (cb) {
  var called = false

  return $.nodemon(config.serverConfig)
    .on('start', function onStart () {
      if (!called) { cb() }
      called = true
    })
    .on('restart', function onRestart () {
      console.log(chalk.green('Restarting node server...'))
    })
})

gulp.task('serve', function (done) {
  browserSync.init({
    proxy: 'http://localhost:8080',
    port: 8081,
    reloadDelay: 1000,
    open: !!$.util.env.open,
    offline: true,
    notify: false
  }, done)
})

gulp.task('watch', ['nodemon', 'serve'])

gulp.task('default', ['watch'])
