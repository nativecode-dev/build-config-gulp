module.exports = (gulp, plugin, util) => {
  'use strict'

  /**
   * @type PackageOptions
   * @param dest {string}             - destination path, defaults to 'dist'.
   * @param src {array|string}        - array or string of globs.
   */

  /**
   * Creates gulp tasks for building a project defined by the options.
   * @param depends {array}           - array of dependent tasks
   * @param options {PackageOptions}  - options?
   */
  return gulp.package = function (depends, options) {
    var filename = util.package.name + '.' + util.package.version + '.zip'
    return gulp.task('package', depends, () => {
      return gulp.src(options.src)
        .pipe(plugin.debug({ title: 'package' }))
        .pipe(plugin.zip(options.dest))
        .pipe(gulp.dest(options.dest))
    })
  }
}
