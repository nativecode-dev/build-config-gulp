'use strict'
var gulp = require('./src/index.js')(require('gulp'))
var plugin = require('gulp-load-plugins')()
gulp.build({
  js: {
    build: src => src
      .pipe(plugin.babel(gulp.config.babel))
      .pipe(plugin.uglify())
      .pipe(gulp.dest('dist')),
    src: ['src/*.js'],
    tasks: ['build:jss']
  },
  jss: {
    build: src => src
      .pipe(plugin.standard())
      .pipe(plugin.standard.reporter('default', { breakOnError: false })),
    src: ['src/*.js']
  }
})
gulp.package(['build'], { src: ['dist/**/*.js'] })
gulp.publish({ tasks: ['package'] }).npm()
gulp.publish({ name: 'publish:major', tasks: ['package'], type: 'major' }).npm()
gulp.publish({ name: 'publish:minor', tasks: ['package'], type: 'minor' }).npm()
gulp.reload(['build'], {
  'package.json': ['build'],
  'src/**/*.js': ['build:js']
})
gulp.task('default', ['build'])
gulp.task('watch', ['build', 'watch:reload'])
