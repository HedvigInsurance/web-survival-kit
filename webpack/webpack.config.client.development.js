const webpack = require('webpack')
const webpackConfig = require('./webpack.config.base')

module.exports = ({
  entryFile,
  modules,
  port = 8081,
  publicPath = `http://0.0.0.0:${port}/`,
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
    plugins: [new webpack.HotModuleReplacementPlugin()],
    context,
  })
