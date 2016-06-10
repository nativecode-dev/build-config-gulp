module.exports = (gulp, core) => {
  return (configuration, options) => {
    options = core.merge(true, configuration.options.publish, options)

    const names = configuration.options.overrides.names

    gulp.task(names.publish, () => {
      core.git.dirty()
    })
  }
}
