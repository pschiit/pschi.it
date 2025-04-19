const { merge } = require('webpack-merge');
const common = require('./webpack.common.js');

module.exports = merge(common, {
  mode: 'development',
  devtool: 'inline-source-map',
  devServer: {
    historyApiFallback: true,
    static: './dist',
    hot: true,
    host: '0.0.0.0',
    port: 8080,
    open: ['http://localhost:8080']
  },
});