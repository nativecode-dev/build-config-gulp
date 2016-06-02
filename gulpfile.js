'use strict'
var gulp = (require('./src/index.js')(require('gulp')))
gulp.build({
  'src/**/*.js': src => src
    .pipe(gulp.use.cached('js'))
    .pipe(gulp.use.standard())
    .pipe(gulp.use.standard.reporter('default', { breakOnError: false }))
    .pipe(gulp.use.jslint())
    .pipe(gulp.use.babel({ presets: ['es2015'] }))
    .pipe(gulp.use.uglify())
    .pipe(gulp.dest('dist'))
})
gulp.package(['build'], { src: ['dist/**/*.js'] })
gulp.publish({ tasks: ['package'] }).npm()
gulp.reload({
  'package.json': ['build'],
  'src/**/*.js': ['build:src/**/*.js']
}, ['build'])
gulp.task('default', ['build'])
gulp.task('watch', ['build', 'watch:reload'])
