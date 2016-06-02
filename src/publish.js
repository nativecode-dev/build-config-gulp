module.exports = (gulp, plugin, util) => {
  'use strict'
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
    options = util.merge({}, defaults, options)
    var gittask = options.name + ':push'
    var npmtask = options.name + ':npm'
    var preptask = options.name + ':prep'
    var pubtask = options.name
    var tagtask = options.name + ':tag'

    gulp.task(tagtask, options.tasks, () => {
      var filter = plugin.filter('package.json', { restore: true })
      return gulp.src(options.src)
        .pipe(plugin.debug({ title: tagtask }))
        // Version bump by type.
        .pipe(plugin.bump(options.bump))
        .pipe(gulp.dest(options.dest))
        // Filter, shrinkwrap, then restore the context.
        .pipe(filter)
        .pipe(plugin.shrinkwrap())
        .pipe(filter.restore)
        .pipe(gulp.dest(options.dest))
        // Commit changes.
        .pipe(plugin.debug({ title: 'git:' }))
        .pipe(plugin.git.commit(options.bump.type))
        // Tag package version.
        .pipe(filter)
        .pipe(plugin.tagVersion())
    })

    return {
      npm: () => {
        gulp.task(gittask, () => {
          plugin.git.push(options.git.remote.name, options.git.branch, options.git.options)
        })

        gulp.task(pubtask, [gittask], (done) => {
          util.spawn(process.platform === 'win32' ? 'npm.cmd' : 'npm', ['publish'], { stdio: 'inherit' }).on('close', done)
        })

        gulp.task(npmtask, [tagtask], () => {
          return gulp.start([gittask, pubtask])
        })
      }
    }
  }
}