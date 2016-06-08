var fs = require('fs')
var render = require('mustache').render
var path = require('path')

module.exports = gulp => {
  var core = {
    array: value => value instanceof Array ? value : [value],
    config: filename => {
      try {
        var json = core.json(filename)
        return core.resolve(json)
      } catch (err) {
        console.log(err)
        return {}
      }
    },
    json: filename => {
      return JSON.parse(core.text(filename))
    },
    merge: require('merge'),
    path: path,
    plugin: {
      bump: require('gulp-bump'),
      cached: require('gulp-cached'),
      clean: require('gulp-clean'),
      debug: require('gulp-debug'),
      filter: require('gulp-filter'),
      git: require('gulp-git'),
      help: require('gulp-help')(gulp),
      mustache: require('gulp-mustache'),
      plumber: require('gulp-plumber'),
      shrinkwrap: require('gulp-shrinkwrap'),
      ssh: require('gulp-ssh'),
      tag: require('gulp-tag-version'),
      util: require('gulp-util'),
      zip: require('gulp-zip')
    },
    resolve: (hash, root) => {
      root = root || hash
      Object.keys(hash).map(key => {
        var value = hash[key]
        if (value.length && value.indexOf(':') === 0) {
          hash[key] = render(value, root).substring(1)
        } else if (value instanceof Object) {
          core.resolve(value, root)
        }
      })
      return root
    },
    spawn: require('child_process').spawn,
    stream: filename => fs.readFileSync(filename),
    task: task => {
      task = core.merge({}, {
        dependencies: [],
        src: [],
        tasks: [],
        type: task.type || 'task'
      }, task)
      if (process.env.debug) {
        core.plugin.util.log('Creating task %s depending on [%s].', task.name, task.dependencies.join(','))
      }
      task.gulp = gulp.task(task.name, task.dependencies, task.build)
      core.tasks[task.name] = task
    },
    taskname: (prefix, name) => prefix + ':' + name,
    tasks: {},
    text: filename => core.stream(filename).toString()
  }

  return core
}
