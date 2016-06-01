module.exports = $gulp => {
  'use strict'
  $gulp.build = require('./build.js')($gulp)
  $gulp.deploy = require('./deploy.js')($gulp)
  $gulp.package = require('./package.js')($gulp)
  $gulp.publish = require('./publish.js')($gulp)
  $gulp.reload = require('./reload.js')($gulp)
  return $gulp
}