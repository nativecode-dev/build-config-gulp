module.exports = gulp => {
  const config = require('build-config')
  const core = require('./core.js')(gulp, config.core)

  return definition => {
    return config(definition, {
      configfile: 'gulpfile.json',
      methods: {
        build: require('./gulp/build.js')(gulp, core),
        clean: require('./gulp/clean.js')(gulp, core),
        deploy: require('./gulp/deploy.js')(gulp, core),
        package: require('./gulp/package.js')(gulp, core),
        publish: require('./gulp/publish.js')(gulp, core),
        watch: require('./gulp/watch.js')(gulp, core),
        wiredep: require('./gulp/wiredep.js')(gulp, core)
      }
    })
  }
}
