'use strict'

var chalk = require('chalk')
var gulp = require('gulp')

var $ = require('gulp-load-plugins')()

// Only instantiated in development
var browserSync

if (!process.env.NODE_ENV || process.env.NODE_ENV === 'development') {
  require('dotenv').load()
}

var config = {
  serverConfig: {}
}

/* NODEMON
 *
 * Watch for changes to the code and
 * restart the node instance if any
 * occur.
 */

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

/* BROWSER SYNC
 *
 * Only in development - watch for
 * changes to the code and refresh
 * the client if any occur.
 */

gulp.task('serve', function (done) {
  browserSync = require('browser-sync').create()
  browserSync.init({
    proxy: 'http://localhost:8080',
    port: 8081,
    reloadDelay: 1000,
    open: !!$.util.env.open,
    offline: true,
    notify: false
  }, done)
})

gulp.task('default', ['nodemon', 'serve'])
