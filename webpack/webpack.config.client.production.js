const webpack = require('webpack')
const { StatsWriterPlugin } = require('webpack-stats-plugin')
const webpackConfig = require('./webpack.config.base')

module.exports = ({ entryFile, path, modules, context, port = 8081, publicPath = `/assets/` }) =>
  webpackConfig({
    entry: { app: ['@babel/polyfill', 'es6-promise', entryFile] },
    modules,
    target: 'web',
    mode: 'production',
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
    context,
    output: {
      filename: '[name]-[hash].js',
      publicPath,
      path,
    },
    plugins: [
      new webpack.LoaderOptionsPlugin({
        minimize: true,
        debug: false,
      }),
      new StatsWriterPlugin({ filename: 'stats.json' }),
    ],
  })
