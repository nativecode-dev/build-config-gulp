/**
 * Creates a gulp task for each filetype provided. Filetype takes
 * on object literal shaped as either a key/function pair or a hash
 * providing these properties:
 *
 * @param filetype        {object}        - Provides file types and associated build instructions.
 * @param filetype.build  {function}      - Function that accepts a `gulp.src`.
 * @param filetype.src    {string|array}  - String or array of file globs.
 * @param filetype.tasks  {array}         - Array of dependent gulp tasks.
 */
module.exports = (gulp, plugin, util) => {
  'use strict'
  return (filetypes, name) => {
    name = name || 'build'
    var depends = []

    Object.keys(filetypes).map((key) => {
      var filetype = (filetypes[key] instanceof Function)
        ? {
          build: filetypes[key],
          name: key,
          src: key.split(';')
        }
        : filetypes[key]

      var taskname = name + ':' + (filetype.name || key)
      depends.push(taskname)

      gulp.task(taskname, filetype.tasks || [], () => {
        var pipe = gulp.src(filetype.src)
          .pipe(plugin.cached(taskname))
          .pipe(plugin.debug({ title: taskname }))
          .pipe(plugin.plumber())
        return filetype.build(pipe)
      })
    })
    return gulp.task(name, depends)
  }
}
