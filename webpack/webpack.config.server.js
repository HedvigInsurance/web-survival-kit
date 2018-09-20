const nodeExternals = require('webpack-node-externals')
const webpackConfig = require('./webpack.config.base')

module.exports = ({ entryFile, path, context, mode, modules }) =>
  webpackConfig({
    entry: ['@babel/polyfill', entryFile],
    modules,
    target: 'node',
    mode,
    context,
    output: {
      filename: 'index.js',
      path,
    },
    node: {
      __dirname: true,
    },
    externals: nodeExternals(),
  })
