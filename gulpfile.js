'use strict'
var gulp = require('./src/index.js')(require('gulp'))
var plugin = require('gulp-load-plugins')()
var $ = gulp.bt.config

gulp.bt.build({
  js: {
    build: src => src
      .pipe(plugin.babel($.babel))
      .pipe(gulp.dest('dist')),
    src: ['src/*.js'],
    tasks: ['build:jss']
  },
  jss: {
    src: () => gulp.src('src/*.js')
      .pipe(plugin.standard())
      .pipe(plugin.standard.reporter('default', { breakOnError: false }))
  }
})

gulp.bt.package(['build'], { src: ['dist/**/*.js'] })

gulp.bt.publish({ tasks: ['package'] }).npm()
gulp.bt.publish({ name: 'publish:major', tasks: ['package'], type: 'major' }).npm()
gulp.bt.publish({ name: 'publish:minor', tasks: ['package'], type: 'minor' }).npm()

gulp.bt.reload('build').when({
  'src/**/*.js': ['build:js']
})

gulp.task('default', ['build'])
