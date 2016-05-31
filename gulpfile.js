'use strict'

var gulp = require('gulp-help')(require('./src/index.js')(require('gulp')))
var plugin = require('gulp-load-plugins')(gulp)

gulp.task('default')
gulp.task('watch', ['build', 'watch:reload'])

gulp.build({
  js: {
    build: src => src
      .pipe(plugin.cached())
      .pipe(plugin.debug({ title: 'js:' }))
      .pipe(plugin.jslint())
      .pipe(plugin.babel({ presets: ['es2015'] }))
      .pipe(gulp.dest('dist')),
    src: ['src/**/*.js']
  }
})

gulp.reload({
  'gulpfile.json': [],
  'package.json': ['build'],
  'src/**/*.js': ['build:js']
}, ['build'])
