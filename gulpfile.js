'use strict'
var configurator = require('./src/index.js')(require('gulp'))
var plugin = require('gulp-load-plugins')()

configurator({
  js: {
    build: stream => stream
      .pipe(plugin.babel({presets: 'es2015'})),
    tasks: 'jslint'
  },
  jslint: {
    build: stream => stream
      .pipe(plugin.standard())
      .pipe(plugin.standard.reporter('stylish', {})),
    src: 'js'
  }
}).build()
  .watch()
