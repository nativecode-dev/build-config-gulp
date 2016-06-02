module.exports = gulp => {
  'use strict'
  // Required dependencies.
  var help = require('gulp-help')(gulp)
  var plugin = require('gulp-load-plugins')(gulp)
  // Common utility functions.
  var util = {
    fs: require('fs'),
    merge: require('merge'),
    path: require('path'),
    spawn: require('child_process').spawn
  }
  util.package = (function () {
    var _package = JSON.parse(util.fs.readFileSync('package.json'))
    _package.refresh = function () {
      return JSON.parse(util.fs.readFileSync('package.json'))
    }
    return _package
  } ())
  // Task creation methods.
  gulp.build = require('./build.js')(gulp, plugin, util)
  gulp.deploy = require('./deploy.js')(gulp, plugin, util)
  gulp.package = require('./package.js')(gulp, plugin, util)
  gulp.publish = require('./publish.js')(gulp, plugin, util)
  gulp.reload = require('./reload.js')(gulp, plugin, util)
  // Gulp extensions.
  gulp.use = plugin
  return gulp
}