const webpack = require('webpack')

module.exports = function override(config) {
  if (!config.plugins) {
    config.plugins = []
  }
  config.plugins.push(
    new webpack.ContextReplacementPlugin(/@truffle\/(contract|interface-adapter)/, (data) => {
      delete data.dependencies[0].critical
      return data
    }),
  )
  return config
}
