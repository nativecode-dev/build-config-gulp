const tasks = {}

module.exports = (gulp, core) => {
  core.chalk = require('chalk')
  core.debug = function () {
    if (!process.env.debug) return
    if (core.plugin.util) {
      return core.plugin.util.log.apply(gulp, arguments)
    }
    return console.log.apply(console, arguments)
  }

  core.pipe = (stream, title) => {
    stream = stream.pipe(core.plugin.cached(title))
    return (process.env.debug ? stream.pipe(core.plugin.debug({title: title})) : stream)
      .pipe(core.plugin.plumber())
  }

  core.spawn = require('child_process').spawn
  core.task = (name, dependencies, callback) => {
    if (dependencies || callback) {
      tasks[name] = gulp.task(name, dependencies, callback)
    }
    return tasks[name]
  }

  // These must come last due to requiring monkey patching
  // from above.
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
    wiredep: require('wiredep'),
    zip: require('gulp-zip')
  }

  return core
}
