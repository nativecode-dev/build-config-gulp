module.exports = (gulp, core) => {
  return (configuration, options) => {
    options = core.merge(true, configuration.options.publish, options)
  }
}
