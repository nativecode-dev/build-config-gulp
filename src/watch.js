module.exports = (gulp, core) => {
  var defoptions = {
    configs: ['bower.json', 'gulpfile.js', 'gulpfile.json', 'package.json'],
    rebuild: true,
    reload: true,
    name: 'watch',
    tasks: []
  }

  var watchers = []

  var gettasks = container => {
    Object.keys(core.tasks).map(key => {
      var value = core.tasks[key]
      if (value.type === 'build') {
        container[key] = {
          src: core.array(value.src),
          tasks: core.array(key)
        }
      }
    })
    return container
  }

  return config => {
    const options = core.merge({}, defoptions, config ? config.options : {})
    const taskreload = core.taskname(options.name, 'reload')
    const taskrebuild = core.taskname(options.name, 'rebuild')

    // Task - watch:rebuild
    core.task({
      build: () => {
        config = gettasks(core.merge({}, config))
        Object.keys(config).map(key => {
          var task = config[key]
          if (key === 'options' || !(task.src && task.src.length)) return
          core.plugin.util.log('Watching for changes to [%s].', task.src.join(', '))
          watchers.push(gulp.watch(task.src, task.tasks))
        })
      },
      dependencies: options.tasks,
      name: taskrebuild
    })

    var spawned = null
    // Task - watch:reload
    core.task({
      build: () => {
        var count = watchers ? watchers.length - 1 : 0
        const args = process.argv.slice(1, 2).concat([taskrebuild])
        const exec = process.argv[0]

        while (count > 0) {
          watchers[count].end().remove()
          count--
        }
        watchers = []

        if (spawned) spawned.kill()
        spawned = core.spawn(exec, args, {
          cwd: process.cwd(),
          stdio: 'inherit'
        })
      },
      name: taskreload,
      src: options.configs
    })

    // Task - watch
    core.task({
      build: () => {
        core.plugin.util.log('Watching for configuration changes to [%s].', options.configs.join(','))
        gulp.watch(options.configs, [taskreload])
      },
      dependencies: [taskreload],
      name: options.name
    })
  }
}
