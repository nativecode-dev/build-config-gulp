module.exports = gulp => {
  'use strict'
  // Required dependencies.
  var plugin = {
    bump: require('gulp-bump'),
    cached: require('gulp-cached'),
    clean: require('gulp-clean'),
    debug: require('gulp-debug'),
    filter: require('gulp-filter'),
    git: require('gulp-git'),
    help: require('gulp-help'),
    plumber: require('gulp-plumber'),
    shrinkwrap: require('gulp-shrinkwrap'),
    ssh: require('gulp-ssh'),
    tag: require('gulp-tag-version'),
    zip: require('gulp-zip')
  }
  // Common utility functions.
  var util = {
    expand: (template, context, options) => {
      var clean = value => options.quote ? options.quote + value + options.quote : value
      while (template.indexOf('{{') >= 0) {
        template = template.replace(/\{\{([\w,_,-,\.]+)\}\}/g, (item, key) => {
          var property = context[key]
          if (property instanceof Array) {
            return property.map(clean).join(',')
          } else if (property instanceof Function) {
            return property().map(clean).join(',')
          }
          return property || item
        })
      }
      return template
    },
    help: require('gulp-help')(gulp),
    fs: require('fs'),
    merge: require('merge'),
    name: (name, parts) => [name].concat(parts).join(':'),
    path: require('path'),
    string: filename => util.fs.readFileSync(filename).toString(),
    spawn: require('child_process').spawn
  }
  util.package = (function () {
    var _package = JSON.parse(util.fs.readFileSync('package.json'))
    _package.refresh = function () {
      return JSON.parse(util.fs.readFileSync('package.json'))
    }
    return _package
  }())
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
