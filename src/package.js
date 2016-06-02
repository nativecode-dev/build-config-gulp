module.exports = (gulp, plugin, util) => {
  'use strict'

  /**
   * @type PackageOptions
   * @param dest {string}             - destination path, defaults to 'dist'.
   * @param format {function}         - format zip file name providing name and version.
   * @param name {string}             - name to use for the task
   * @param src {array|string}        - array or string of globs.
   */

  /**
   * Creates gulp tasks for building a project defined by the options.
   *
   * @param depends {array}           - array of dependent tasks
   * @param options {PackageOptions}  - options?
   */
  gulp.package = function (depends, options) {
    options = util.merge({}, {
      dest: 'dist',
      format: (name, version) => name + '.' + version + '.zip',
      name: 'package',
      src: []
    }, options)
    return gulp.task(options.name, depends, () => {
      var filename = options.format(util.package.name, util.package.version)
      return gulp.src(options.src)
        .pipe(plugin.debug({ title: options.name }))
        .pipe(plugin.zip(filename))
        .pipe(gulp.dest(options.dest))
    })
  }
  return gulp.package
}
