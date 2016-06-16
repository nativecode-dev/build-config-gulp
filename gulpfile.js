'use strict'
var configure = require('./src/index.js')(require('gulp'))
var plugin = require('gulp-load-plugins')()

configure({
  js: {
    build: stream => stream
      .pipe(plugin.babel({presets: 'es2015'})),
    tasks: 'jslint'
  },
  jslint: {
    build: stream => stream
      .pipe(plugin.standard())
      .pipe(plugin.standard.reporter('stylish', { breakOnError: true })),
    dest: false
  },
  text: {
    build: (stream, $) => stream
      .pipe(plugin.mustache($)),
    dest: '.',
    src: ['src/LICENSE', 'src/README.md']
  }
})
  .build()
  .clean()
  .package()
  .publish()
  .watch()
