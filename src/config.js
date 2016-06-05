module.exports = (plugin, util) => {
  return {
    load: filename => {
      var filepath = util.path.join(process.cwd(), filename || 'gulpfile.json')
      if (util.fs.statSync(filepath)) {
        return JSON.parse(util.fs.readFileSync(filepath))
      }
    }
  }
}
