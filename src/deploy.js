module.exports = (gulp, plugin, util) => {
  'use strict'
  var defaults = {
    ssh: {
      logfile: 'ssh.log',
      logpath: 'logs',
      privateKeyPath: undefined,
      remote: {
        host: undefined,
        password: undefined,
        path: undefined,
        port: 22,
        username: undefined
      },
      src: ['dist/**/*', '!dist/**/*.zip'],
      zip: true
    }
  }
  return {
    ssh: options => {
      options = util.merge({}, options.ssh, defaults)
      var connect = function () {
        return plugin.ssh({
          ignoreErrors: false,
          sshConfig: util.merge({}, options.remote, {
            privateKey: options.privateKeyPath
              ? util.string(options.privateKeyPath)
              : undefined
          })
        })
      }
      gulp.task('deploy:ssh', ['deploy:ssh:send'], () => {
        var stream = connect()
        if (options.zip) {
          var zipname = util.package.name + '.zip'
          stream = stream.exec(util.expand('unzip {{path}}/{{zipname}} {{path}}', {
            path: options.remote.path,
            zipname: zipname
          }), { filePath: options.logfile })
        }
        return stream.pipe(gulp.dest(options.logfile))
      })
      gulp.task('deploy:ssh:clean', () => {
        return connect()
          .exec('rm -rf ' + options.remote.path, { filePath: options.logfile })
          .pipe(gulp.dest(options.logpath))
      })
      gulp.task('deploy:ssh:send', ['deploy:ssh:clean'], () => {
        var stream = gulp.src(options.src)
          .pipe(plugin.plumber())
        if (options.zip) {
          var zipname = util.package.name + '.zip'
          stream = stream.pipe(plugin.zip(zipname))
            .pipe(plugin.filter(zipname))
        }
        return stream.pipe(connect().dest(options.remote.path))
      })
    }
  }
}
