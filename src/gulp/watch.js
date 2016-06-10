module.exports = (gulp, core) => {
  var spawned = null

  return (configuration, options) => {
    options = core.merge(true, configuration.options.watch, options)

    if (!configuration.options.watch) {
      throw new Error('Watches have been disabled. If you wish to enable them, set the watch object back to the default')
    }

    const names = configuration.common.names
    const watches = Object.keys(configuration.watches)

    // Create individual watch tasks, i.e. build:js becomes watch:js.
    watches.map(key => {
      const watch = configuration.watches[key]
      core.debug('[%s] source: %s', watch.name, core.quote(watch.source))
      core.debug('[%s] target: %s', watch.name, core.quote(watch.dependencies))

      gulp.task(watch.name, () => {
        if (configuration.builds[key]) {
          gulp.watch(watch.source, [configuration.builds[key].name])
        } else {
          gulp.watch(watch.source, watch.dependencies)
        }
      })
    })

    // Create main watch entry task. If we have configuration watching enabled,
    // we can use those as dependencies. Otherwise, we want a task that spawns
    // a new instance and kills the previous one.
    const resurrect = tasks => {
      var args = process.argv.slice(1, 2).concat(tasks || [])
      var exec = process.argv[0]

      if (spawned) spawned.kill()
      spawned = core.spawn(exec, args, {
        cwd: process.cwd(),
        stdio: 'inherit'
      })
      return spawned
    }

    // If configuration watching is enabled, we want to ensure we always spawn a new process
    // that we can control from this main process. All builds will run from the spawned
    // process. Otherwise, we just perform a watch directly.
    const dependencies = watches.map(key => configuration.watches[key].name).concat(names.build)
    if (options.configurations) {
      gulp.task(names.watch, () => {
        resurrect(dependencies)
        gulp.watch(options.configurations.src, { debounceDelay: options.debounce, interval: options.interval }, () => resurrect(dependencies))
      })
    } else {
      gulp.task(names.watch, dependencies)
    }
  }
}
