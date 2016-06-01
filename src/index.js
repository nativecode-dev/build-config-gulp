module.exports = $gulp => {
  'use strict'
  require('gulp-help')($gulp)
  $gulp.build = require('./build.js')($gulp)
  $gulp.deploy = require('./deploy.js')($gulp)
  $gulp.package = require('./package.js')($gulp)
  $gulp.publish = require('./publish.js')($gulp)
  $gulp.reload = require('./reload.js')($gulp)
  $gulp.use = require('gulp-load-plugins')($gulp)
  return $gulp
}