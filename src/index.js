module.exports = gulp => {
  const core = require('./core.js')(gulp)

  return definition => {
    return require('build-config')(definition, {
      build: require('./gulp/build.js')(gulp, core),
      clean: require('./gulp/clean.js')(gulp, core),
      deploy: require('./gulp/deploy.js')(gulp, core),
      package: require('./gulp/package.js')(gulp, core),
      publish: require('./gulp/publish.js')(gulp, core),
      watch: require('./gulp/watch.js')(gulp, core)
    })
  }
}
