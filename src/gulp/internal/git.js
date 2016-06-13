module.exports = (gulp, core) => {
  const git = require('gulp-git')

  core.task('git:dirtycheck', [], done => {
    core.git.check.dirty(dirty => {
      if (dirty) {
        core.plugin.util.log(core.chalk.bgRed(' Current local repository has uncommitted changes. '))
        dirty.split('\n').map(line => core.plugin.util.log(core.chalk.red(line.trim())))
        done('error')
      } else {
        done()
      }
    })
  })

  return {
    $: git,
    check: {
      dirty: callback => {
        git.status({ args: '--porcelain', quiet: true }, (err, stdout) => {
          if (err) throw err
          return callback(stdout)
        })
      }
    }
  }
}
