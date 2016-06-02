module.exports = (gulp, plugin, util) => {
  'use strict'
  var defaults = {
    ssh: {
      events: {
        configure: () => { },
        send: () => { }
      },
      privateKeyPath: undefined,
      remote: {
        host: undefined,
        path: undefined,
        port: 22
      }
    }
  }
  gulp.deploy = {
    ssh: options => {
      options = util.merge({}, options, defaults)
      function connect () {
        return plugin.ssh({
          ignoreErrors: false,
          sshConfig: util.merge({}, options.ssh.remote, {
            privateKey: options.ssh.privateKeyPath
              ? util.string(options.ssh.privateKeyPath)
              : undefined
          })
        })
      }
    }
  }
  return gulp.deploy
}
