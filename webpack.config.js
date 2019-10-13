const { resolve } = require('path')

module.exports = {
  mode: 'production',
  target: 'node',
  entry: resolve('src', 'bin.ts'),
  output: {
    path: resolve('dist'),
    filename: 'bin.js',
    sourceMapFilename: 'bin.js.map'
  },
  module: {
    rules: [
      {
        exclude: /node_modules/,
        test: /\.ts?$/,
        use: [{ loader: 'ts-loader', options: { configFile: 'tsconfig.build.json' } }]
      }
    ]
  },
  devtool: 'source-map',
  resolve: {
    extensions: ['.ts', '.js']
  }
}
