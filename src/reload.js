module.exports = (gulp, plugin, util) => {
  'use strict'
  var defaults = {
    configuration: {
      src: ['bower.json', 'gulpfile.js', 'gulpfile.json', 'package.json']
    }
  }
  var watchers = []
  return depends => {
    depends = util.array(depends)
    return {
      when: options => {
        options = util.merge({}, defaults, { watchers: options })
        gulp.task('watch:rebuild', () => {
          Object.keys(options.watchers).map(glob => {
            watchers.push(gulp.watch(glob, options.watchers[glob]))
          })
        })

        var dependents = ['watch:rebuild'].concat(depends || [])
        gulp.task('watch', dependents, () => {
          var spawned = null
          gulp.watch(options.configuration.src, () => {
            var options = process.argv.slice(1, 2).concat(dependents)
            var count = watchers ? watchers.length - 1 : 0
            var exec = process.argv[0]

            while (count > 0) {
              watchers[count].end().remove()
              count--
            }
            watchers = []

            if (spawned) {
              spawned.kill()
            }

            spawned = require('child_process').spawn(exec, options, {
              cwd: process.cwd(),
              stdio: 'inherit'
            })
          })
        })
      }
    }
  }
}
