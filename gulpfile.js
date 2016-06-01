'use strict'

var gulp = require('gulp-help')(require('./src/index.js')(require('gulp')))
var plugin = require('gulp-load-plugins')(gulp)

gulp.task('default', ['build'])
gulp.task('watch', ['build', 'watch:reload'])

gulp.build({
  js: {
    build: src => src
      .pipe(plugin.cached())
      .pipe(plugin.debug({ title: 'js:' }))
      .pipe(plugin.jslint())
      .pipe(plugin.babel({ presets: ['es2015'] }))
      .pipe(plugin.uglify())
      .pipe(gulp.dest('dist')),
    src: ['src/**/*.js']
  }
})

gulp.publish({ tasks: ['build'] }).npm()

gulp.reload({
  'gulpfile.json': [],
  'package.json': ['build'],
  'src/**/*.js': ['build:js']
}, ['build'])
