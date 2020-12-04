const { removeWebpackPlugin } = require('@rescripts/utilities')

module.exports = config => {
  const webpackWithoutEsLint = removeWebpackPlugin('ESLintWebpackPlugin', config)
  return webpackWithoutEsLint
}