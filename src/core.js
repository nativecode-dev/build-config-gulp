module.exports = (gulp, core) => {
  core.debug = function () {
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
    help: require('gulp-help')(gulp),
    plumber: require('gulp-plumber'),
    shrinkwrap: require('gulp-shrinkwrap'),
    ssh: require('gulp-ssh'),
    util: require('gulp-util'),
    zip: require('gulp-zip')
  }

  core.quote = (value, quote, separator) => {
    quote = quote || "'"
    separator = separator || ', '
    if (core.is.array(value)) {
      return value.map(item => core.quote(item)).join(separator)
    }
    if (core.is.string(value)) {
      return quote + value + quote
    }
    return value
  }

  core.spawn = require('child_process').spawn

  return core
}
