'use strict'
var gulp = require('./src/index.js')(require('gulp'))
var plugin = require('gulp-load-plugins')(gulp)
gulp.build({
  js: {
    build: src => src
      .pipe(plugin.standard())
      .pipe(plugin.standard.reporter('default', { breakOnError: false }))
      .pipe(plugin.jslint())
      .pipe(plugin.babel({ presets: ['es2015'] }))
      .pipe(plugin.uglify())
      .pipe(gulp.dest('dist')),
    src: ['src/**/*.js']
  }
})
gulp.package(['build'], { src: ['dist/**/*.js'] })
gulp.publish({ tasks: ['package'] }).npm()
gulp.reload(['build'], {
  'package.json': ['build'],
  'src/**/*.js': ['build:js']
})
gulp.task('default', ['build'])
gulp.task('watch', ['build', 'watch:reload'])
