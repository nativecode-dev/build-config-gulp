var fs = require('fs')
var render = require('mustache').render
var path = require('path')

module.exports = gulp => {
  var core = {
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
    navigate: (hash, path) => {
      const parts = path.split('.')
      var current = hash
      for (var index = 0; index < parts.length; index++) {
        const key = parts[index]
        if (!current[key]) {
          throw new Error('Key ' + key + 'not found from ' + path + '.')
        }
        current = current[key]
      }
      return current
    },
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
    text: filename => core.stream(filename).toString()
  }

  return core
}
