module.exports = $gulp => {
  'use strict'
  var merge = require('merge')
  var plugin = require('gulp-load-plugins')($gulp)
  $gulp = $gulp || require('gulp')

  return $gulp.build = function ($filetypes, $name) {
    $name = $name || 'build'
    var depends = []
    Object.keys($filetypes).map((key) => {
      var filetype = ($filetypes[key] instanceof Function)
        ? {
          build: $filetypes[key],
          name: key,
          src: key.split(',')
        }
        : $filetypes[key]
      var taskname = $name + ':' + (filetype.name || key)

      depends.push(taskname)
      $gulp.task(taskname, filetype.tasks || [], () => {
        return filetype.build($gulp.src(filetype.src).pipe(plugin.cached()).pipe(plugin.debug()))
      })
    })
    return $gulp.task($name, depends)
  }
}