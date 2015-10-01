'use strict'

var browserify = require('browserify')
var buffer = require('vinyl-buffer')
var chalk = require('chalk')
var gulp = require('gulp')
// var merge = require('merge-stream')()
var source = require('vinyl-source-stream')

var $ = require('gulp-load-plugins')()

var bs = null // For Browser-Sync

if (!process.env.NODE_ENV || process.env.NODE_ENV === 'development') {
  require('dotenv').load()
}

var config = {
  js: {
    angular: {
      entries: ['./src/app.js'],
      outputName: 'app.js'
    },
    libs: [
      './node_modules/angular/angular.js',
      './node_modules/angular-resource/angular-resource.js'
    ],
    dest: './public/angular'
  },
  less: {
    src: ['./node_modules/bootstrap/dist/css/bootstrap.css'],
    dest: './public/stylesheets/css/'
  }
}

/*
 * GULP TASKS
 */

gulp.task('default', ['build', 'nodemon', 'syncBrowser'])

gulp.task('build', ['build:libs', 'build:css', 'build:js'])

/*
 * BUILD JAVASCRIPT LIBRARIES
 */

gulp.task('build:libs', function () {
  var prod = !!$.util.env.production

  return buildLibs({minify: prod})
})

function buildLibs (args) {
  return gulp.src(config.js.libs)
    .pipe($.changed(config.js.dest))
    .pipe($.sourcemaps.init({loadMaps: true}))
      .pipe($.if(args.minify, $.uglify()))
      .pipe($.concat('libs.js'))
    .pipe($.sourcemaps.write('./'))
    .pipe(gulp.dest(config.js.dest))
}

/*
 * BUILD STYLESHEETS
 */

gulp.task('build:css', function () {
  var prod = !!$.util.env.production

  return buildCss({minify: prod})
})

function buildCss (args) {
  return gulp.src(config.less.src)
    .pipe($.plumber())
    .pipe($.sourcemaps.init())
    .pipe($.less())
    .pipe($.if(args.minify, $.minifyCss()))
    .pipe($.sourcemaps.write('./'))
    .pipe(gulp.dest(config.less.dest))
}

/*
 * Bundle JS Apps
 */

gulp.task('build:js', function () {
  var prod = !!$.util.env.production

  return buildJs({
    minify: prod,
    watch: !prod
  })
})

function buildJs (args) {
  var bundler = browserify({
    cache: {},
    packageCache: {},
    fullPaths: args.watch,
    entries: config.js.angular.entries,
    debug: true
  })

  bundler.transform(require('browserify-plain-jade'))

  function bundle () {
    var jsStream = bundler
      .bundle()
      .on('error', function (error) {
        console.error('Error building javascript!')
        console.error(error.message)
        this.emit('end')
      })
      .pipe(source(config.js.angular.outputName))
      .pipe(buffer())
      .pipe($.plumber())
      .pipe($.sourcemaps.init({loadMaps: true}))
      .pipe($.if(args.minify, $.uglify()))
      .pipe($.sourcemaps.write('./'))
      .pipe(gulp.dest(config.js.dest))
      .on('finish', function () {
        if (bs) {
          bs.reload(config.js.dest + config.js.angular.outputName)
        }
      })
    return jsStream
  }

  if (args.watch) {
    var watchify = require('watchify')
    bundler = watchify(bundler)
    bundler.on('update', bundle)
  }

  return bundle()
}

/*
 * NODEMON
 */

gulp.task('nodemon', nodemon)

function nodemon () {
  return $.nodemon()
    .on('restart', function onRestart () {
      console.log(chalk.green('Restarting node server...'))
    })
}

/*
 * BROWSER SYNC
 */

gulp.task('syncBrowser', syncBrowser)

function syncBrowser (done) {
  bs = require('browser-sync').create()
  bs.init({
    proxy: 'http://localhost:8080',
    port: 8081,
    reloadDelay: 1000,
    open: !!$.util.env.open,
    offline: true,
    notify: false }, done)
}

/*
 * WATCHIFY
 */

/*
gulp.task('watch', watch)

function watch () {
}
*/
