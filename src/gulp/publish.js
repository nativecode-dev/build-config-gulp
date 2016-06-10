module.exports = (gulp, core) => {
  return (configuration, options) => {
    options = core.merge(true, configuration.options.publish, options)

    const names = configuration.common.names

    gulp.task(names.publish, done => {
      core.git.check.dirty(dirty => {
        if (dirty) {
          core.plugin.util.log('Current local repository has uncommitted changes.')
          core.plugin.util.log(dirty)
        } else {
          // Do the real stuff
        }
        done()
      })
    })
  }
}
