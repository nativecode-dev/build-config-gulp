module.exports = (gulp, plugin, util) => {
  'use strict'
  return gulp.build = function ($filetypes, $name) {
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
      gulp.task(taskname, filetype.tasks || [], () => {
        var pipe = gulp.src(filetype.src)
          .pipe(plugin.cached())
          .pipe(plugin.debug({ title: taskname }))
        return filetype.build(pipe)
      })
    })
    return gulp.task($name, depends)
  }
}