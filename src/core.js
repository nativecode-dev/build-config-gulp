module.exports = (gulp, core) => {
  core.debug = function () {
    if (!process.env.debug) return
    if (core.plugin.util) {
      return core.plugin.util.log.apply(gulp, arguments)
    }
    return console.log.apply(console, arguments)
  }

  core.git = require('./gulp/internal/git.js')(gulp, core)

  core.plugin = {
    bump: require('gulp-bump'),
    cached: require('gulp-cached'),
    clean: require('gulp-clean'),
    debug: require('gulp-debug'),
    filter: require('gulp-filter'),
    git: core.git.$,
    help: require('gulp-help')(gulp),
    plumber: require('gulp-plumber'),
    shrinkwrap: require('gulp-shrinkwrap'),
    ssh: require('gulp-ssh'),
    util: require('gulp-util'),
    zip: require('gulp-zip')
  }

  core.spawn = require('child_process').spawn

  return core
}
