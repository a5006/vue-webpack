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
      '/richinfohr': {
        target: 'http://192.168.4.105:8080/richinfohr',
        // target: 'http://192.168.40.75:8088/richinfohr/',
        ws: true,
        changeOrigin: true,
        pathRewrite: {
          '^/richinfohr': ''
        }
      }
    }
  },
  plugins: [new Webpack.HotModuleReplacementPlugin()]
});
