/*eslint-disable*/
const autoprefixer = require('autoprefixer')
const cssmixins = require('postcss-mixins')
const cssvars = require('postcss-simple-vars')
const webpack = require('webpack')
const HtmlWebPackPlugin = require('html-webpack-plugin')
const CircularDependencyPlugin = require('circular-dependency-plugin')

const paths = require('./paths')
const getClientEnvironment = require('./env')

const publicPath = '/'

// `publicUrl` we will provide it to our app
// as %PUBLIC_URL% in `index.html` and `process.env.PUBLIC_URL` in JavaScript.
// Omit trailing slash as %PUBLIC_PATH%/xyz looks better than %PUBLIC_PATH%xyz.
var publicUrl = ''
// Get environment variables to inject into our app.
var env = getClientEnvironment(publicUrl)

const cssvariables = require(paths.appSrc + '/theme/variables')

const postcssPlugins = [
  autoprefixer({
    overrideBrowserslist: [
      '>1%',
      'last 4 versions',
      'Firefox ESR',
      'not ie < 9', // React doesn't support IE8 anyway
    ],
  }),
  cssmixins,
  cssvars({
    variables: function() {
      return Object.assign({}, cssvariables)
    },
    silent: false,
  }),
]

module.exports = {
  devtool: 'eval-source-map',
  mode: 'development',
  entry: [
    '@babel/polyfill',
    // Include an alternative client for WebpackDevServer. A client's job is to
    // connect to WebpackDevServer by a socket and get notified about changes.
    // When you save a file, the client will either apply hot updates (in case
    // of CSS changes), or refresh the page (in case of JS changes). When you
    // make a syntax error, this client will display a syntax error overlay.
    // Note: instead of the default WebpackDevServer client, we use a custom one
    // to bring better experience for Create React App users. You can replace
    // the line below with these two lines if you prefer the stock client:
    // require.resolve('webpack-dev-server/client') + '?/',
    // require.resolve('webpack/hot/dev-server'),
    require.resolve('react-dev-utils/webpackHotDevClient'),
    // We ship a few polyfills by default:
    require.resolve('./polyfills'),
    // Finally, this is your app's code:
    paths.appIndexJs,
    // We include the app code last so that if there is a runtime error during
    // initialization, it doesn't blow up the WebpackDevServer client, and
    // changing JS code would still trigger a refresh.
  ],
  resolve: {
    modules: [paths.appSrc, 'node_modules', paths.appContracts],
    // These are the reasonable defaults supported by the Node ecosystem.
    // We also include JSX as a common component filename extension to support
    // some tools, although we do not recommend using it, see:
    // https://github.com/facebookincubator/create-react-app/issues/290
    extensions: ['.js', '.json', '.jsx'],
    alias: {
      '~': paths.appSrc,
      '#': paths.appContracts,
    },
  },
  output: {
    // Next line is not used in dev but WebpackDevServer crashes without it:
    path: paths.appBuild,
    // Add /* filename */ comments to generated require()s in the output.
    pathinfo: true,
    // This does not produce a real file. It's just the virtual path that is
    // served by WebpackDevServer in development. This is the JS bundle
    // containing code from all our entry points, and the Webpack runtime.
    filename: 'static/js/bundle.js',
    // This is the URL that app is served from. We use "/" in development.
    publicPath: publicPath,
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
        },
      },
      {
        test: /\.(scss|css)$/,
        use: [
          'style-loader',
          {
            loader: 'css-loader',
            options: {
              importLoaders: 1,
              modules: {
                localIdentName: '[name]__[local]___[hash:base64:5]',
              },
            },
          },
          {
            loader: 'postcss-loader',
            options: {
              sourceMap: true,
              plugins: postcssPlugins,
            },
          },
        ],
      },
      { test: /\.(woff|woff2)$/, loader: 'url-loader?limit=100000' },
      {
        test: /\.html$/,
        use: [
          {
            loader: 'html-loader',
            options: { minimize: false },
          },
        ],
      },
      {
        test: /\.(jpe?g|png|svg)$/i,
        exclude: /node_modules/,
        use: [
          {
            loader: 'file-loader',
            options: {
              name: 'img/[hash].[ext]',
            },
          },
        ],
      },
    ],
  },
  plugins: [
    new HtmlWebPackPlugin({
      template: paths.appHtml,
    }),
    new webpack.DefinePlugin(env),
    new webpack.HotModuleReplacementPlugin(),
    // new CircularDependencyPlugin({
    //   // exclude detection of files based on a RegExp
    //   exclude: /a\.js|node_modules/,
    //   // include specific files based on a RegExp
    //   include: /src/,
    //   // add errors to webpack instead of warnings
    //   failOnError: true,
    //   // allow import cycles that include an asyncronous import,
    //   // e.g. via import(/* webpackMode: "weak" */ './file.js')
    //   allowAsyncCycles: false,
    //   // set the current working directory for displaying module paths
    //   cwd: process.cwd(),
    // })
  ],
  // Some libraries import Node modules but don't use them in the browser.
  // Tell Webpack to provide empty mocks for them so importing them works.
  node: {
    fs: 'empty',
    net: 'empty',
    tls: 'empty',
  },
}
