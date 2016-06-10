module.exports = (gulp, core) => {
  return (configuration, options) => {
    const names = configuration.options.overrides.names
    const builds = Object.keys(configuration.builds)

    builds.map(key => {
      const build = configuration.builds[key]
      core.debug('[%s] source: %s', build.name, core.quote(build.source))
      core.debug('[%s] target: %s', build.name, core.quote(build.target))
      core.debug('[%s] depends: %s', build.name, core.quote(build.dependencies))

      gulp.task(build.name, build.dependencies, () => {
        var stream = core.is.func(build.build)
          ? build.build(gulp.src(build.source))
          : gulp.src(build.source)

        stream = stream.pipe(core.plugin.cached(build.name))

        if (process.env.debug) {
          stream = stream.pipe(core.plugin.debug({title: '[' + key + ']'}))
        }
        stream = stream.pipe(core.plugin.plumber())

        return build.target ? stream.pipe(gulp.dest(build.target)) : stream
      })
    })

    gulp.task(names.build, builds.map(key => configuration.builds[key].name))

    if (configuration.options.build.default) {
      gulp.task('default', [names.build])
    }
  }
}
