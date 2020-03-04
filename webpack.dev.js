const Webpack = require('webpack');
const WebpackConfig = require('./webpack.config');
const WebpackMerge = require('webpack-merge');
module.exports = WebpackMerge(WebpackConfig, {
  mode: 'development',
  devtool: 'cheap-module-eval-source-map',
  devServer: {
    port: 4000,
    hot: true,
    contentBase: '../dist',
    proxy: {
      '/api': {
        target: 'xxxx',
        ws: true,
        changeOrigin: true,
        pathRewrite: {
          '^/xxx': ''
        }
      }
    }
  },
  plugins: [new Webpack.HotModuleReplacementPlugin()]
});
