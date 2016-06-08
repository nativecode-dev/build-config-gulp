'use strict'
var gulp = require('./src/index.js')(require('gulp'))
var plugin = require('gulp-load-plugins')()

var $ = gulp.gulpfile

gulp.build({
  options: { default: true },
  js: {
    build: stream => stream
      .pipe(plugin.babel($.babel)),
    src: $.js.src,
    tasks: ['jslint']
  },
  jslint: {
    build: stream => stream.pipe(plugin.standard())
      .pipe(plugin.standard.reporter('default', {})),
    src: $.js.src
  }
}).watch({
  options: { tasks: ['build'] }
})
