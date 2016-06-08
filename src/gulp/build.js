module.exports = (gulp, core) => {
  return (configuration, options) => {
    const names = configuration.options.overrides.names
    const builds = Object.keys(configuration.builds)
    const buildname = names.build
    builds.map(key => {
      const build = configuration.builds[key]
      gulp.task(build.name, build.dependencies, () => {
        var stream = typeof build.build === 'function'
          ? build.build(gulp.src(build.source))
          : gulp.src(build.source)

        return stream
          .pipe(core.plugin.cached(build.name))
          .pipe(core.plugin.debug({title: '[' + key + ']'}))
          .pipe(core.plugin.plumber())
          .pipe(gulp.dest(build.target))
      })
    })

    gulp.task(buildname, builds.map(key => configuration.builds[key].name))
    gulp.task('default', [buildname])
  }
}
