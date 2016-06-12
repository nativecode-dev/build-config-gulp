module.exports = (gulp, core) => {
  return (configuration, options) => {
    options = core.merge(true, configuration.options.wiredep, options)
    const names = configuration.common.names

    gulp.task(names.wiredep, () => {
      return gulp.src(options.src)
        .pipe(core.plugin.wiredep.stream(options.options))
    })
  }
}
