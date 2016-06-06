module.exports = (plugin, util) => {
  var resolve = function (hash, root) {
    root = root || hash
    Object.keys(hash).map(key => {
      var value = hash[key]
      if (value.length && value.indexOf(':') === 0) {
        var expanded = util.expand(value).with(root).substring(1)
        hash[key] = expanded
      } else if (value instanceof Object) {
        resolve(value, root)
      }
    })
    return root
  }
  return {
    load: (filename, asis) => {
      var filepath = util.path.join(process.cwd(), filename || 'gulpfile.json')
      if (util.fs.statSync(filepath)) {
        var json = JSON.parse(util.fs.readFileSync(filepath))
        return asis ? json : resolve(json)
      }
    }
  }
}
