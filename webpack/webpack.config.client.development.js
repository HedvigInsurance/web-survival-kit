const webpack = require('webpack')
const webpackConfig = require('./webpack.config.base')

module.exports = ({
  entryFile,
  modules,
  port,
  publicPath,
  path,
  context,
}) =>
  webpackConfig({
    entry: {
      app: ['@babel/polyfill', 'es6-promise', entryFile],
    },
    modules,
    target: 'web',
    mode: 'development',
    devServer: {
      compress: true,
      hot: true,
      inline: true,
      host: '0.0.0.0',
      disableHostCheck: true,
      port,
      headers: {
        'Access-Control-Allow-Origin': '*',
      },
    },
    output: {
      filename: '[name].js',
      publicPath,
      path,
    },
    plugins: [
      new webpack.HotModuleReplacementPlugin(),
      new webpack.DefinePlugin({
        'process.env': {
          NODE_ENV: JSON.stringify('development'),
        },
      }),
    ],
    context,
  })
