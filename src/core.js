const tasks = {}

module.exports = (gulp, core) => {
  core.plugin = {
    bump: require('gulp-bump'),
    cached: require('gulp-cached'),
    clean: require('gulp-clean'),
    debug: require('gulp-debug'),
    filter: require('gulp-filter'),
    help: require('gulp-help')(gulp),
    plumber: require('gulp-plumber'),
    prompt: require('gulp-prompt'),
    shrinkwrap: require('gulp-shrinkwrap'),
    ssh: require('gulp-ssh'),
    util: require('gulp-util'),
    wiredep: require('wiredep'),
    zip: require('gulp-zip')
  }

  core.chalk = core.plugin.util.colors

  core.debug = (...args) => {
    if (!process.env.debug) return
    const message = core.chalk.gray(core.print(args))
    if (core.plugin.util) {
      return core.plugin.util.log.apply(gulp, [message])
    }
    return console.log(message)
  }

  core.pipe = (stream, title) => {
    core.require(stream)
    core.require(title)
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

  core.git = require('./gulp/git.js')(gulp, core)

  return core
}
