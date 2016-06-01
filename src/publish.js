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

    $gulp.task(tagtask, () => {
      var filter = plugin.filter('package.json', { restore: true })
      return $gulp.src(options.src)
        .pipe(plugin.debug())
        // Version bump by type.
        .pipe(plugin.bump(options.bump))
        // Filter, shrinkwrap, then restore the context.
        .pipe(filter)
        .pipe(plugin.shrinkwrap())
        .pipe(filter.restore)
        .pipe($gulp.dest(options.dest))
        // Commit changes.
        .pipe(plugin.git.commit(options.bump.type))
        // Tag package version.
        .pipe(filter)
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