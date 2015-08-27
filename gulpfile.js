'use strict'

var browserify = require('browserify')
var buffer = require('vinyl-buffer')
var chalk = require('chalk')
var gulp = require('gulp')
var merge = require('merge-stream')()
var source = require('vinyl-source-stream')

var $ = require('gulp-load-plugins')()

// Only instantiated in development
var browserSync

if (!process.env.NODE_ENV || process.env.NODE_ENV === 'development') {
  require('dotenv').load()
}

var config = {
  js: {
    bundles: [
      {
        entries: ['./src/app.js'],
        outputName: 'app.js'
      }
    ],
    libs: [
      './node_modules/jquery/dist/jquery.js',
      './node_modules/angular/angular.js'
    ],
    dest: './public/angular'
  },
  serverConfig: {}
}

/*
 * Bundle JS Apps
 */

function buildJs (config) {
  var bundler = browserify({
    cache: {},
    packageCache: {},
    fullPaths: config.watch,
    entries: config.entries,
    debug: true
  })

  bundler.transform(require('browserify-plain-jade'))

  function bundle () {
    console.log(chalk.blue('Bundling...'))
    var jsStream = bundler.bundle()
      .on('error', function (error) {
        console.error('Error building javascript!')
        console.error(error.message)
        this.emit('end')
      })
      .pipe(source(config.outputName))
      .pipe(buffer())
      .pipe($.plumber())
      .pipe($.sourcemaps.init({loadMaps: true}))
      .pipe($.if(config.minify, $.uglify()))
      .pipe($.sourcemaps.write('./'))
      .pipe(gulp.dest(config.dest))
      .on('finish', function () {
        if (browserSync) {
          browserSync.reload(config.dest + config.outputName)
        }
        console.log(chalk.green('Build JS Completed'))
      })

    return jsStream
  }

  if (config.watch) {
    console.log(chalk.yellow('Starting watchify...'))
    var watchify = require('watchify')
    bundler = watchify(bundler)
    bundler.on('update', bundle)
  }

  return bundle()
}

/*
 * Use merge to combine multiple
 * Gulp streams into one task
 */

function javascript (watch, minify) {
  return merge.add(config.js.bundles.map(function (c) {
    c.watch = watch
    c.minify = minify
    c.dest = config.js.dest
    return buildJs(c)
  }))
}

function copyJsLibs () {
  return gulp.src(config.js.libs)
    .pipe($.changed(config.js.dest))
    .pipe($.sourcemaps.init({loadMaps: true}))
    .pipe($.uglify())
    .pipe($.concat('libs.js'))
    .pipe($.sourcemaps.write('./'))
    .pipe(gulp.dest(config.js.dest))
}

/* NODEMON
 *
 * Watch for changes to the code and
 * restart the node instance if any
 * occur.
 */

function nodemon (cb) {
  var called = false

  return $.nodemon(config.serverConfig)
    .on('start', function onStart () {
      if (!called) { cb() }
      called = true
    })
    .on('restart', function onRestart () {
      console.log(chalk.green('Restarting node server...'))
    })
}

/* BROWSER SYNC
 *
 * Only in development - watch for
 * changes to the code and refresh
 * the client if any occur.
 */

function serve (done) {
  browserSync = require('browser-sync').create()
  browserSync.init({
    proxy: 'http://localhost:8080',
    port: 8081,
    reloadDelay: 1000,
    open: !!$.util.env.open,
    offline: true,
    notify: false
  }, done)
}

/*
 * Gulp task for watching
 * changes to angular in development
 */

gulp.task('watch', function () {
  javascript(true, false)
})
gulp.task('js:libs', copyJsLibs)
gulp.task('nodemon', nodemon)
gulp.task('serve', serve)

gulp.task('default', ['nodemon', 'serve', 'js:libs', 'watch'])
