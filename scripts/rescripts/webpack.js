const { removeWebpackPlugin, appendWebpackPlugin } = require('@rescripts/utilities')
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

module.exports = config => {
  const webpackWithoutEsLint = removeWebpackPlugin('ESLintWebpackPlugin', config)
  return appendWebpackPlugin(
    new CleanWebpackPlugin(),
    webpackWithoutEsLint,
  )
}