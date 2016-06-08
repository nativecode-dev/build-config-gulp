module.exports = gulp => {
  var core = require('./core.js')(gulp)

  return {
    $gulp: gulp,
    build: require('./define.js')(gulp, core),
    dest: gulp.dest,
    gulpfile: core.config('gulpfile.json'),
    src: gulp.src,
    task: gulp.task
  }
}
