const webpack = require('webpack')
const path = require('path')
const babelrc = require('../.babelrc')

module.exports = ({
  modules,
  mode,
  entry,
  target,
  plugins,
  output,
  context,
  ...rest
}) => ({
  mode,
  resolve: {
    extensions: ['.ts', '.tsx', '.js', '.json'],
    modules: [path.resolve(context, 'node_modules'), path.resolve('src')],
  },
  entry,
  module: {
    rules: [
      {
        test: /\.(tsx?|js)$/,
        loader: 'babel-loader',
        options: babelrc,
      },
    ],
  },
  devtool: 'source-map',
  target,
  context,
  stats: {
    colors: true,
    chunks: false,
    chunkModules: false,
    children: false,
  },
  output,
  plugins: [new webpack.NamedModulesPlugin(), ...(plugins || [])],
  bail: true,
  ...rest,
})
