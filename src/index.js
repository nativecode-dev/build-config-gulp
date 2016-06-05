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
    path: require('path'),
    plumber: require('gulp-plumber'),
    shrinkwrap: require('gulp-shrinkwrap'),
    ssh: require('gulp-ssh'),
    tag: require('gulp-tag-version'),
    util: require('gulp-util'),
    zip: require('gulp-zip')
  }
  // Common utility functions.
  var util = {
    array: value => (value instanceof Array) ? value : [value],
    expand: template => {
      return {
        with: context => require('mustache').render(template, context)
      }
    },
    help: require('gulp-help')(gulp),
    fs: require('fs'),
    merge: require('merge'),
    name: (name, parts) => [name].concat(parts).join(':'),
    path: require('path'),
    package: () => util.load('package.json'),
    spawn: require('child_process').spawn,
    string: filename => util.fs.readFileSync(filename).toString()
  }
  util.load = require('./config.js')(plugin, util).load
  // Task creation methods.
  gulp.bt = {
    build: require('./build.js')(gulp, plugin, util),
    config: util.load('gulpfile.json'),
    deploy: require('./deploy.js')(gulp, plugin, util),
    package: require('./package.js')(gulp, plugin, util),
    publish: require('./publish.js')(gulp, plugin, util),
    reload: require('./reload.js')(gulp, plugin, util)
  }
  return gulp
}
