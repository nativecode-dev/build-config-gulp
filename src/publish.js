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
    src: ['bower.json', 'bower-shrinkwrap.json', 'npm-shrinkwrap.json', 'package.json'],
    tasks: undefined
  }

  return (options) => {
    options = util.merge({}, defaults, options)
    var committask = options.name + ':commit'
    var gittask = options.name + ':push'
    var npmtask = options.name + ':npm'
    var pubtask = options.name
    var tagtask = options.name + ':tag'

    /**
     * Creates a task to tag the current version. This task will:
     * - bump the version of provided sources
     * - shrinkwrap the package.json
     * - tag the local repo
     */
    gulp.task(tagtask, options.tasks, () => {
      var filter = plugin.filter('package.json', { restore: true })
      return gulp.src(options.src)
        .pipe(plugin.debug({ title: tagtask }))
        .pipe(plugin.plumber())
        // Version bump by type.
        .pipe(plugin.bump(options.bump))
        .pipe(gulp.dest(options.dest))
        // Filter, shrinkwrap, then restore the context.
        .pipe(filter)
        .pipe(plugin.shrinkwrap())
        .pipe(filter.restore)
        .pipe(gulp.dest(options.dest))
        // Tag package version.
        .pipe(filter)
        .pipe(plugin.tag())
    })

    /**
     * Creates a git commit task on all of the sources that were
     * version stamped.
     */
    gulp.task(committask, [tagtask], () => {
      return gulp.src(options.src)
        // Commit changes.
        .pipe(plugin.debug({ title: 'git:' }))
        .pipe(plugin.plumber())
        .pipe(plugin.git.commit(options.bump.type))
    })

    return {
      npm: () => {
        /**
         * Pushes changes to remote repo.
         */
        gulp.task(gittask, () => {
          plugin.git.push(options.git.remote.name, options.git.branch, options.git.options)
        })

        /**
         * Publishes package to registry.
         */
        gulp.task(pubtask, [gittask], (done) => {
          util.spawn(process.platform === 'win32' ? 'npm.cmd' : 'npm', ['publish'], { stdio: 'inherit' }).on('close', done)
        })

        gulp.task(npmtask, [committask], () => {
          return gulp.start([gittask, pubtask])
        })
      }
    }
  }
}
