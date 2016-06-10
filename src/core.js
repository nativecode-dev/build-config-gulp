module.exports = (gulp, core) => {
  core.debug = function () { core.plugin.util.log.apply(gulp, arguments) }
  core.plugin = {
    bump: require('gulp-bump'),
    cached: require('gulp-cached'),
    clean: require('gulp-clean'),
    debug: require('gulp-debug'),
    filter: require('gulp-filter'),
    git: require('gulp-git'),
    help: require('gulp-help')(gulp),
    mustache: require('gulp-mustache'),
    plumber: require('gulp-plumber'),
    shrinkwrap: require('gulp-shrinkwrap'),
    ssh: require('gulp-ssh'),
    tag: require('gulp-tag-version'),
    util: require('gulp-util'),
    zip: require('gulp-zip')
  }
  core.spawn = require('child_process').spawn
  return core
}
