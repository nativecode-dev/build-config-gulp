module.exports = ($gulp) => {
  'use strict'
  var $fs = require('fs')
  var $merge = require('merge')
  var $zip = require('gulp-zip')
  $gulp = $gulp || require('gulp')

  /**
   * @returns PackageOptions
   * @param dest {string}             - destination path, defaults to 'dist'.
   * @param src {array|string}        - array or string of globs.
   */

  /**
   * Creates gulp tasks for building a project defined by the options.
   * @param depends {array}           - array of dependent tasks
   * @param options {PackageOptions}  - options?
   */
  return $gulp.package = function (depends, options) {
    var _package = JSON.parse($fs.readFileSync('package.json'))
    var filename = _package.name + '.' + _package.version + '.zip'
    return $gulp.task('package', depends, () => {
      return $gulp.src(options.src)
        .pipe($zip(options.dest))
        .pipe($gulp.dest(options.dest))
    })
  }

}
