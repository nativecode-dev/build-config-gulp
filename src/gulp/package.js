module.exports = (gulp, core) => {
  return (configuration, options) => {
    options = core.merge(true, configuration.options.package, options)

    const common = configuration.common
    const names = configuration.options.overrides.names
    const ziptask = core.taskname(names.package, 'zip')

    gulp.task(names.package, [names.clean], () => {
      return gulp.start(ziptask)
    })

    gulp.task(ziptask, core.array(options.tasks), () => {
      var stream = gulp.src(options.src)

      const zipname = core.render(options.format, core.json(options.context))

      if (common.debug) {
        stream = stream.pipe(core.plugin.debug({ title: zipname }))
      }

      return stream
        .pipe(core.plugin.plumber())
        .pipe(core.plugin.zip(zipname))
        .pipe(gulp.dest(options.dest))
    })
  }
}
