module.exports = (gulp, plugin, util) => {
  'use strict'
  var defaults = {
    ssh: {
      events: {
        configure: () => { },
        send: () => { },
      },
      privateKeyPath: undefined,
      options: {
        host: undefined,
        path: undefined,
        port: 22
      }
    }
  }
  return gulp.deploy = {
    ssh: options => {
      options = util.merge({}, options, defaults)
      function connect() {
        return plugin.ssh({
          ignoreErrors: false,
          sshConfig: util.merge({}, options.ssh.options, {
            privateKey: options.ssh.privateKeyPath
              ? util.fs.readFileSync(options.ssh.privateKeyPath).toString()
              : undefined
          })
        })
      }

    }
  }
}