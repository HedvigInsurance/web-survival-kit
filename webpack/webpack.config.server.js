const webpack = require('webpack')
const nodeExternals = require('webpack-node-externals')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const webpackConfig = require('./webpack.config.base')

module.exports = ({
  entryFile,
  path,
  publicPath,
  context,
  mode,
  modules,
  envVars = [],
}) =>
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
          ...envVars.reduce(
            (acc, envVar) => ({
              ...acc,
              [envVar]: `process.env.${envVar}`,
            }),
            {},
          ),
        },
      }),
      new CopyWebpackPlugin([{ from: 'assets/**/*', to: path }]),
    ],
    externals: nodeExternals(),
  })
