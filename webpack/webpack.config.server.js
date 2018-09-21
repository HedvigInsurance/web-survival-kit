const webpack = require('webpack')
const nodeExternals = require('webpack-node-externals')
const webpackConfig = require('./webpack.config.base')

module.exports = ({ entryFile, path, publicPath, context, mode, modules }) =>
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
      __dirname: false,
    },
    plugins: [
      new webpack.DefinePlugin({
        'process.env': {
          NODE_ENV: 'process.env.NODE_ENV',
          PORT: 'process.env.PORT',
          WEBPACK_PUBLIC_PATH: JSON.stringify(publicPath),
        },
      }),
    ],
    externals: nodeExternals(),
  })
