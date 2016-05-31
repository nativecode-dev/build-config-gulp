module.exports = ($gulp) => {
  'use strict'
  var merge = require('merge')
  $gulp = $gulp || require('gulp')

  return $gulp.build = function ($filetypes, $name) {
    $name = $name || 'build'
    var depends = []
    Object.keys($filetypes).map((key) => {
      var filetype = ($filetypes[key] instanceof Function)
        ? {
          build: $filetypes[key],
          src: $filetypes[key]
        }
        : $filetypes[key]
      var taskname = $name + ':' + (filetype.name || key)

      depends.push(taskname)
      $gulp.task(taskname, filetype.tasks || [], () => {
        return filetype.build($gulp.src(filetype.src))
      })
    })
    return $gulp.task($name, depends)
  }

}