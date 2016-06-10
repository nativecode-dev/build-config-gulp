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
    dest: false,
    build: stream => stream
      .pipe(plugin.standard())
      .pipe(plugin.standard.reporter('default', {}))
  }
})
  .build()
  .clean()
  .package()
  .publish()
  .watch()
  .wiredep()
