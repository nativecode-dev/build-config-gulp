module.exports = (gulp, core) => {
  var spawned = null

  return configuration => {
    const names = configuration.options.overrides.names
    const options = configuration.options.watch
    const watches = Object.keys(configuration.watches)

    // Create individual watch tasks, i.e. build:js becomes watch:js.
    watches.map(key => {
      const watch = configuration.watches[key]
      gulp.task(watch.name, () => {
        core.plugin.util.log('Watching for changes to [%s].', watch.source.join(', '))
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

    const dependencies = watches.map(key => configuration.watches[key].name).concat(names.build)
    if (options.configurations.enabled) {
      gulp.task(names.watch, () => {
        resurrect(dependencies)
        gulp.watch(options.configurations.src, () => resurrect(dependencies))
      })
    } else {
      gulp.task(names.watch, dependencies)
    }
  }
}
