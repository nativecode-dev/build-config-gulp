module.exports = (gulp, core) => {
  return (configuration, options) => {
    const names = configuration.common.names
    const builds = Object.keys(configuration.builds)

    const context = core.resolve(core.merge(true, configuration, core.json('package.json')), null, true)

    builds.map(key => {
      const build = configuration.builds[key]
      core.debug('[%s] source: %s', build.name, core.quote(build.source))
      core.debug('[%s] target: %s', build.name, core.quote(build.target))
      core.debug('[%s] depends: %s', build.name, core.quote(build.dependencies))

      core.task(build.name, build.dependencies, () => {
        let stream = core.is.func(build.build)
          ? build.build(core.pipe(gulp.src(build.source), key), context)
          : core.pipe(gulp.src(build.source), key)

        return build.target ? stream.pipe(gulp.dest(build.target)) : stream
      })
    })

    core.task(names.build, builds.map(key => configuration.builds[key].name))

    if (configuration.options.build.default) {
      core.task('default', [names.build])
    }
  }
}
