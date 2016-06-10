module.exports = (gulp, core) => {
  const git = require('gulp-git')

  return {
    $: git,
    dirty: () => {
      git.status({ args: '--porcelain' })
    }
  }
}
