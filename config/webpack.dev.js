const autoprefixer = require('autoprefixer');
const cssvars = require('postcss-simple-vars');
const HtmlWebPackPlugin = require("html-webpack-plugin");
const paths = require('./paths');

const cssvariables = require(paths.appSrc + '/theme/variables');

const postcssPlugins = [
  autoprefixer({
    browsers: [
      '>1%',
      'last 4 versions',
      'Firefox ESR',
      'not ie < 9', // React doesn't support IE8 anyway
    ]
  }),
  cssvars({
    variables: function () {
        return Object.assign({}, cssvariables);
    },
    silent: false
  }),
];

module.exports = {
  devtool: 'cheap-module-source-map',
  resolve: { 
    extensions: ['.js', '.json', '.jsx'],
  },  
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader"
        }
      },
      {
        test: /\.(scss|css)$/,
        use: [
          'style-loader',
          { loader: 'css-loader',
            options: {
              importLoaders: 1,
              modules: true,
              minimize: false,
              localIdentName: '[name]__[local]___[hash:base64:5]',
            }
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
      {
        test: /\.html$/,
        use: [
          {
            loader: "html-loader",
            options: { minimize: true }
          }
        ]
      }
    ]
  },
  plugins: [
    new HtmlWebPackPlugin({
      template: paths.appHtml,
      filename: "./index.html"
    })
  ]
};
