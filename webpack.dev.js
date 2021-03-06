const path = require('path')
const CaseSensitivePathsWebpackPlugin = require('case-sensitive-paths-webpack-plugin')
const { merge } = require('webpack-merge')
const common = require('./webpack.common')

module.exports = merge(common, {
  mode: 'development',
  devtool: 'inline-source-map',
  output: {
    filename: 'static/js/bundle.js',
    chunkFilename: 'static/js/[name].chunk.js',
  },
  plugins: [new CaseSensitivePathsWebpackPlugin()],
  devServer: {
    static: {
      directory: path.join(__dirname, 'public'),
    },
    hot: true,
    historyApiFallback: true,
    proxy: {},
  },
})
