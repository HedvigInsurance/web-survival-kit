const webpack = require('webpack')
const { StatsWriterPlugin } = require('webpack-stats-plugin')
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer')
const webpackConfig = require('./webpack.config.base')

module.exports = ({ entryFile, path, publicPath, modules, context, analyze }) =>
  webpackConfig({
    entry: { app: ['@babel/polyfill', 'es6-promise', entryFile] },
    modules,
    target: 'web',
    mode: 'production',
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
      new webpack.DefinePlugin({
        'process.env': {
          NODE_ENV: JSON.stringify('production'),
        },
      }),
      new StatsWriterPlugin({ filename: 'stats.json' }),
      analyze && new BundleAnalyzerPlugin(),
    ].filter(Boolean),
  })
