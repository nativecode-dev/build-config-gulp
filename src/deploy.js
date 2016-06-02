module.exports = (gulp, plugin, util) => {
  'use strict'
  var defaults = {
    ssh: {
      events: {
        clean: ssh => { },
        complete: ssh => { },
        send: ssh => { }
      },
      logfile: 'ssh.log',
      logpath: 'logs',
      privateKeyPath: undefined,
      remote: {
        host: undefined,
        path: undefined,
        port: 22
      },
      src: ['dist/**/*', '!dist/**/*.zip']
    }
  }
  gulp.deploy = {
    ssh: options => {
      options = util.merge({}, options.ssh, defaults)
      function connect () {
        return plugin.ssh({
          ignoreErrors: false,
          sshConfig: util.merge({}, options.remote, {
            privateKey: options.privateKeyPath
              ? util.string(options.privateKeyPath)
              : undefined
          })
        })
      }
      gulp.task('deploy:ssh', ['ssh:send'], () => {
        return gulp.src(options.src)
          .pipe(plugin.plumber())
          .pipe(connect().dest(options.remote.path))
      })
      gulp.task('deploy:ssh:clean', () => {
        return connect()
          .pipe(plugin.plumber())
          .exec('rm -rf ' + options.remote.path, { filePath: options.logfile })
          .pipe(gulp.dest(options.logpath))
      })
      gulp.task('deploy:ssh:send', ['ssh:clean'], () => {
      })
    }
  }
  return gulp.deploy
}
