'use strict'
var gulp = (require('./src/index.js')(require('gulp')))
gulp.build({
  js: {
    build: src => src
      .pipe(gulp.use.standard())
      .pipe(gulp.use.standard.reporter('default', { breakOnError: false }))
      .pipe(gulp.use.jslint())
      .pipe(gulp.use.babel({ presets: ['es2015'] }))
      .pipe(gulp.use.uglify())
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
