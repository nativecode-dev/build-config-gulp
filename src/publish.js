module.exports = $gulp => {
  'use strict'
  var bump = require('gulp-bump')
  var git = require('gulp-git')
  var merge = require('merge')
  var plugin = require('gulp-load-plugins')($gulp)

  var defaults = {
    bump: { type: 'patch' },
    dest: '.',
    git: {
      branch: 'master',
      options: { args: ' -f' },
      remote: { name: 'origin' }
    },
    name: 'publish',
    src: 'package.json',
    tasks: undefined
  }

  function push(options) {
    git.push(options.git.remote.name, options.git.branch, options.git.options, err => {
      console.log(err)
    })
  }

  return $gulp.publish = {
    npm: function (options) {
      options = merge({}, defaults, options)
      return $gulp.task(options.name + ':npm', options.tasks, () => {
        return $gulp.src(options.src)
          .pipe(plugin.debug())
          .pipe(bump(options.bump))
          .on('complete', () => push(options))
          .pipe($gulp.dest(options.dest))
      })
    }
  }
}