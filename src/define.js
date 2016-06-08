module.exports = (gulp, core) => {
  const plugin = core.plugin

  const defbuild = {
    build: stream => stream,
    dest: core.config('gulpfile.json').dest || false,
    tasks: []
  }

  const defoptions = {
    default: false,
    name: 'build'
  }

  return configs => {
    const getbuild = (key, value) => {
      if (value instanceof Function) {
        value = {
          build: value,
          src: core.array(key)
        }
      }
      return core.merge({}, defbuild, value)
    }

    const getstream = build => {
      if (build.src instanceof Function) {
        return build.src()
      }
      return gulp.src(build.src)
    }

    const getsrc = build => {
      if (build.src instanceof Function) {
        return []
      }
      return build.src
    }

    const getdependencies = build => {
      const tasks = []
      Object.keys(build.tasks).map(key => {
        const task = build.tasks[key]
        if (configs[task]) {
          tasks.push(core.taskname(options.name, task))
        } else {
          tasks.push(task)
        }
      })
      return tasks
    }

    const dependencies = []
    const options = core.merge({}, defoptions, configs.options)

    Object.keys(configs).map(key => {
      // Skip any key named options.
      if (key === 'options') return

      // Setup build configuration.
      var build = getbuild(key, configs[key])
      const taskname = core.taskname(options.name, key)
      dependencies.push(taskname)

      // Create source-specific build task.
      core.task({
        build: () => {
          var stream = getstream(build)
            .pipe(plugin.debug({ title: taskname }))
            .pipe(plugin.cached(taskname))
            .pipe(plugin.plumber())

          stream = build.build(stream)
          return build.dest ? stream.pipe(gulp.dest(build.dest)) : stream
        },
        dependencies: getdependencies(build),
        name: taskname,
        src: getsrc(build),
        type: 'build'
      })
    })

    // Create all-encompassing build task.
    core.task({
      dependencies: dependencies,
      name: options.name
    })

    // Create a default task that calls our all-encompassing build ask
    if (options.default) {
      core.task({
        dependencies: [options.name],
        name: 'default'
      })
    }

    return {
      watch: require('./watch.js')(gulp, core)
    }
  }
}
