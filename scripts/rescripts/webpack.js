const { removeWebpackPlugin, appendWebpackPlugin } = require('@rescripts/utilities')
const CircularDependencyPlugin = require('circular-dependency-plugin')

module.exports = (config) => {
  const webpackWithoutEsLint = removeWebpackPlugin('ESLintWebpackPlugin', config)
  const webpackConfig = appendWebpackPlugin(
    new CircularDependencyPlugin({
      // exclude detection of files based on a RegExp
      exclude: /a\.js|node_modules/,
      // add errors to webpack instead of warnings
      // failOnError: true,
      // allow import cycles that include an asyncronous import,
      // e.g. via import(/* webpackMode: "weak" */ './file.js')
      allowAsyncCycles: false,
      // set the current working directory for displaying module paths
      cwd: process.cwd(),
    }),
    webpackWithoutEsLint,
  )
  return webpackConfig
}
