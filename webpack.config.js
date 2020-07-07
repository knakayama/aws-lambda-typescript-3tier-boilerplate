const path = require('path')
const TsconfigPathsPlugin = require('tsconfig-paths-webpack-plugin')

module.exports = {
  mode: 'development',
  devtool: 'inline-source-map',
  target: 'node',
  entry: {
    'say-something': path.resolve(__dirname, './src/externals/events/api/say-something.ts')
  },
  externals: [{
    'aws-sdk': 'commonjs aws-sdk'
  }],
  module: {
    rules: [
      {
        test: /\.ts$/,
        use: 'ts-loader',
        exclude: /\.(d|spec)\.ts/
      }
    ]
  },
  resolve: {
    extensions: ['.ts', '.js'],
    plugins: [new TsconfigPathsPlugin()]
  },
  output: {
    libraryTarget: 'commonjs2',
    filename: '[name]/index.js',
    path: path.resolve(__dirname, 'dist')
  }
}
