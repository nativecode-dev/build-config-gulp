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
    zip: require('gulp-zip')
  }
  // Common utility functions.
  var util = {
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
    spawn: require('child_process').spawn,
    string: filename => util.fs.readFileSync(filename).toString()
  }
  util.package = (() => {
    var _package = JSON.parse(util.fs.readFileSync('package.json'))
    _package.refresh = function () {
      return JSON.parse(util.fs.readFileSync('package.json'))
    }
    return _package
  })()
  // Task creation methods.
  gulp.bt = {
    build: require('./build.js')(gulp, plugin, util),
    deploy: require('./deploy.js')(gulp, plugin, util),
    package: require('./package.js')(gulp, plugin, util),
    publish: require('./publish.js')(gulp, plugin, util),
    reload: require('./reload.js')(gulp, plugin, util)
  }
  // Check if there is a gulpfile.json so we can load the configuration.
  var configpath = util.path.join(process.cwd(), 'gulpfile.json')
  try {
    if (util.fs.statSync(configpath)) {
      gulp.bt.config = JSON.parse(util.fs.readFileSync(configpath))
    }
  } catch (err) {
    // Do nothing!
  }
  return gulp
}
