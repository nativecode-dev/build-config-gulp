module.exports = (gulp, plugin, util) => {
  'use strict'
  var watchers = []
  return (depends, options) => {
    gulp.task('watch:rebuild', () => {
      Object.keys(options).map((glob) => {
        watchers.push(gulp.watch(glob, options[glob]))
      })
    })

    return gulp.task('watch:reload', ['watch:rebuild'], () => {
      var spawned = null
      gulp.watch('gulpfile.js', () => {
        var options = process.argv.slice(1, 2).concat(depends || [], ['watch:rebuild'])
        var count = watchers ? watchers.length - 1 : 0
        var exec = process.argv[0]

        while (count > 0) {
          watchers[count].end().remove()
          count--
        }
        watchers = []

        if (spawned) {
          spawned.kill()
        }

        spawned = require('child_process').spawn(exec, options, {
          cwd: process.cwd(),
          stdio: 'inherit'
        })
      })
    })
  }
}
