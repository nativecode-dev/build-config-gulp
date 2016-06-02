'use strict'

var gulp = (require('./src/index.js')(require('gulp')))

/**
 * Configures our build pipeline for processing the JS
 * files.
 */
gulp.build({
  'src/**/*.js': src => src
    .pipe(gulp.use.cached('js'))
    .pipe(gulp.use.jslint())
    .pipe(gulp.use.babel({ presets: ['es2015'] }))
    .pipe(gulp.use.uglify())
    .pipe(gulp.dest('dist'))
})

/**
 * Enable publishing to our private NPM registry.
 */
gulp.publish({
  src: ['package.json', 'npm-shrinkwrap.json'],
  tasks: ['build']
}).npm()

/**
 * Enable file watchers, which includes watching
 * the gulpfile.js itself.
 */
gulp.reload({
  'package.json': ['build'],
  'src/**/*.js': ['build:src/**/*.js']
}, ['build'])

/**
 * Common tasks wrapped into nice names.
 */
gulp.task('default', ['build'])
gulp.task('watch', ['build', 'watch:reload'])
