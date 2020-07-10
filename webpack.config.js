const path = require('path')
const TsconfigPathsPlugin = require('tsconfig-paths-webpack-plugin')
const glob = require('glob')

module.exports = {
  mode: 'development',
  devtool: 'inline-source-map',
  target: 'node',
  entry: () => {
    const entries = {}
    const matches = glob.sync(path.resolve(__dirname, './src/externals/events/**/*.ts'))
    matches.forEach(match => {
      Object.assign(entries, {
        [path.basename(match, '.ts')]: match
      })
    })
    return entries
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
