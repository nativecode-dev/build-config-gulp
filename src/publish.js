module.exports = $gulp => {
  'use strict'
  var merge = require('merge')
  var plugin = require('gulp-load-plugins')($gulp)
  var spawn = require('child_process').spawn;

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

  return (options) => {
    options = merge({}, defaults, options)
    var npmtask = options.name + ':npm'
    var tagtask = options.name + ':tag'
    $gulp.task(tagtask, () => {
      return $gulp.src(options.src)
        .pipe(plugin.debug())
        .pipe(plugin.bump(options.bump))
        .pipe($gulp.dest(options.dest))
        .pipe(plugin.git.commit(options.bump.type))
        .pipe(plugin.tagVersion())
    })

    return {
      npm: () => {
        $gulp.task(npmtask, options.tasks.concat([tagtask]), () => {
          plugin.git.push(options.git.remote.name, options.git.branch, options.git.options)
        })
      }
    }
  }
}