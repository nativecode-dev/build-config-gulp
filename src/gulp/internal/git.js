module.exports = (gulp, core) => {
  const git = require('gulp-git')

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
