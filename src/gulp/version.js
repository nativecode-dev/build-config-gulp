module.exports = (gulp, core) => {
  return (configuration, options) => {
    options = core.merge(true, configuration.options.publish, options)

    const common = configuration.common
    const names = common.names

    core.task(names.publish, ['git:dirtycheck'], () => {
      return core.pipe(gulp.src(options.src), names.publish)
        .pipe(core.plugin.tag())
        .pipe(core.plugin.bump())
        .pipe(gulp.dest(options.dest || common.dest))
    })
  }
}
