const { webpackConfig } = require('@rails/webpacker')

module.exports = webpackConfig


const path = require('path')

module.exports = {
  entry: {
    application: './app/javascript/packs/application.js'
  },
  output: {
    filename: '[name].js',
    path: path.resolve(__dirname, 'public/packs')
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env']
          }
        }
      }
    ]
  }
}
