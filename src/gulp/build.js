module.exports = (gulp, core) => {
  return (configuration, options) => {
    const names = configuration.options.overrides.names
    const builds = Object.keys(configuration.builds)

    builds.map(key => {
      const config = configuration.builds[key]

      gulp.task(config.name, config.dependencies, () => {
        var stream = core.is.func(config.build)
          ? config.build(gulp.src(config.source))
          : gulp.src(config.source)

        stream = stream.pipe(core.plugin.cached(config.name))

        if (process.env.debug) {
          stream = stream.pipe(core.plugin.debug({title: '[' + key + ']'}))
        }
        stream = stream.pipe(core.plugin.plumber())

        return config.target ? stream.pipe(gulp.dest(config.target)) : stream
      })
    })

    gulp.task(names.build, builds.map(key => configuration.builds[key].name))

    if (configuration.options.build.default) {
      gulp.task('default', [names.build])
    }
  }
}
