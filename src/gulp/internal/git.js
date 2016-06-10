module.exports = (gulp, core) => {
  const git = core.plugin.git

  return configuration => {
    return {
      branch: git.branch,
      clone: git.clone,
      commit: git.commit,
      push: git.push,
      pull: git.pull
    }
  }
}
