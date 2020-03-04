const path = require('path');
const WebpackConfig = require('./webpack.config');
const WebpackMerge = require('webpack-merge');
const OptimizeCssAssetsplugin = require('optimize-css-assets-webpack-plugin');
const CompressionPlugin = require('compression-webpack-plugin');
const PreloadWebpackPlugin = require('preload-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');
module.exports = WebpackMerge(WebpackConfig, {
  mode: 'production',
  // devtool: "cheap-module-source-map", //正式环境sorce map
  plugins: [],
  optimization: {
    minimizer: [
      new TerserPlugin({
        terserOptions: {
          cache: true,
          compress: {
            warnings: false,
            drop_console: false,
            drop_debugger: false
          }
        },
        extractComments: true
      }),
      // new PreloadWebpackPlugin({ // 预加载
      //   rel: "preload",
      //   as: "script",
      //   include: "asyncChunks"
      // }),
      new OptimizeCssAssetsplugin({
        assetNameRegExp: /\.css$/g, //正则匹配
        cssProcessor: require('cssnano'),
        cssProcessorOptions: {
          safe: true,
          discardComments: { removeAll: true }
        },
        canPrint: true
      }), //压缩css
      new CompressionPlugin({
        //开启gzip压缩
        test: /\.js$|\.html$|\.css$|\.less/,
        threshold: 10240,
        deleteOriginalAssets: false
      })
    ],
    splitChunks: {
      //分离第三包库文件
      chunks: 'all',
      maxInitialRequests: Infinity,
      minSize: 300000,
      automaticNameDelimiter: '-',
      cacheGroups: {
        vendor: {
          test: /[\\/]node_modules[\\/]/,
          name(module) {
            const packageName = module.context.match(
              /[\\/]node_modules[\\/](.*?)([\\/]|$)/
            )[1];
            return `chunk.${packageName.replace('@', '')}`;
          },
          priority: 2
        }
      }
    }
  }
});
