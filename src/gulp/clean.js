module.exports = (gulp, core) => {
  return (configuration, options) => {
    options = core.merge(true, {}, options)

    const common = configuration.common
    const names = configuration.common.names

    const cleaner = (name, src) => {
      var stream = gulp.src(src)

      if (common.debug) {
        stream = stream.pipe(core.plugin.debug({ title: name }))
      }

      return stream.pipe(core.plugin.clean())
    }

    const dependencies = []

    if (common.artifacts) {
      const artifacts = core.taskname(names.clean, 'artifacts')
      dependencies.push(artifacts)
      core.task(artifacts, () => cleaner(artifacts, common.artifacts))
    }

    if (common.dest) {
      const dest = core.taskname(names.clean, 'dest')
      dependencies.push(dest)
      core.task(dest, () => cleaner(dest, common.dest))
    }

    Object.keys(options).map(key => {
      const value = options[key]
      const name = core.taskname(names.clean, key)
      core.task(name, () => cleaner(name, value))
      dependencies.push(name)
    })

    core.task(names.clean, dependencies)
  }
}
