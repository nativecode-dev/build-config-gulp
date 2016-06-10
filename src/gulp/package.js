module.exports = (gulp, core) => {
  return (configuration, options) => {
    const common = configuration.common
    options = core.merge(true, configuration.options.package, options)

    // SHIM: Shim until this gets moved upstream.
    options.context = options.context ? options.context : 'package.json'
    options.dest = common.artifacts ? common.artifacts : options.dest
    // SHIM

    const names = configuration.common.names
    const zipname = core.render(options.format, core.json(options.context))
    const ziptask = core.taskname(names.package, 'zip')

    core.debug('[%s] source: %s', ziptask, core.quote(options.src))
    core.debug('[%s] target: %s', ziptask, core.quote(zipname))

    gulp.task(names.package, [names.clean], () => {
      return gulp.start(ziptask)
    })

    gulp.task(ziptask, core.array(options.tasks), () => {
      var stream = gulp.src(options.src)

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
