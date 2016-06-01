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
      options: { args: ' --tag' },
      remote: { name: 'origin' }
    },
    name: 'publish',
    src: ['bower.json', 'package.json'],
    tasks: undefined
  }

  return (options) => {
    options = merge({}, defaults, options)
    var npmtask = options.name + ':npm'
    var preptask = options.name + ':prep'
    var tagtask = options.name + ':tag'

    $gulp.task(preptask, () => {
      return $gulp.src(options.src)
        .pipe(plugin.debug())
        .pipe(plugin.bump(options.bump))
        .pipe(plugin.filter('package.json'))
        .pipe(plugin.shrinkwrap())
        .pipe($gulp.dest(options.dest))
    })

    $gulp.task(tagtask, [preptask], () => {
      return $gulp.src(options.src)
        .pipe(plugin.debug())
        .pipe(plugin.git.commit(options.bump.type))
        .pipe(plugin.filter('package.json'))
        .pipe(plugin.tagVersion())
    })

    return {
      npm: () => {
        $gulp.task(npmtask, options.tasks.concat([tagtask]), (done) => {
          plugin.git.push(options.git.remote.name, options.git.branch, options.git.options)
          spawn(process.platform === 'win32' ? 'npm.cmd' : 'npm', ['publish'], { stdio: 'inherit' }).on('close', done)
        })
      }
    }
  }
}