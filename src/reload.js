module.exports = $gulp => {
  'use strict'
  var watchers = []
  return $gulp.reload = function ($watches, $tasks) {
    $gulp.task('watch:rebuild', () => {
      Object.keys($watches).map((glob) => {
        watchers.push($gulp.watch(glob, $watches[glob]))
      })
    })

    return $gulp.task('watch:reload', ['watch:rebuild'], () => {
      var spawned = undefined
      $gulp.watch('gulpfile.js', () => {
        var options = process.argv.slice(1, 2).concat($tasks || [], ['watch:rebuild']),
          count = watchers ? watchers.length - 1 : 0,
          exec = process.argv[0]

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