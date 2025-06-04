import { merge } from 'webpack-merge';
import common from './webpack.common.mjs';

export default merge(common, {
  mode: 'development',
  devtool: 'inline-source-map',
  devServer: {
    historyApiFallback: true,
    static: './build',
    hot: true,
    host: '0.0.0.0',
    port: 8080,
    open: ['http://localhost:8080']
  },
});