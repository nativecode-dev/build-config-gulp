module.exports = $gulp => {
  'use strict'
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
    src: ['bower.json', 'package.json'],
    tasks: undefined
  }

  return $gulp.publish = {
    npm: function (options) {
      options = merge({}, defaults, options)
      return $gulp.task(options.name + ':npm', options.tasks, () => {
        return $gulp.src(options.src)
          .pipe(plugin.debug())
          .pipe(plugin.bump(options.bump))
          .pipe($gulp.dest(options.dest))
          .pipe(plugin.git.commit(options.bump.type + ' ' + require('package.json').version))
          .pipe(plugin.tagVersion())
          .pipe(plugin.git.push(options.git.remove.name, options.git.branch, options.git.options))
      })
    }
  }
}