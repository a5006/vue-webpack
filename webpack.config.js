const path = require('path');
const os = require('os');
const { CleanWebpackPlugin } = require('clean-webpack-plugin'); //清楚html模板
const HtmlWebpackPlugin = require('html-webpack-plugin'); // 生成index.html 入口文件
const MiniCssExtractPlugin = require('mini-css-extract-plugin'); // css 文件处理
const CopyWebpackPlugin = require('copy-webpack-plugin'); // 复制静态资源
const Webpack = require('webpack');
const vueLoaderPlugin = require('vue-loader/lib/plugin'); // vueloader
const devMode = process.env.NODE_ENV === 'development'; // 是否为开发环境
const HappyPack = require('happypack'); // happypack包
const glob = require('glob-all'); // 路径匹配
const happyThreadPool = HappyPack.ThreadPool({ size: os.cpus().length }); // happypack多核cpu加快打包构建
const PurgecssPlugin = require('purgecss-webpack-plugin'); //css treeshaking
module.exports = {
  entry: {
    main: path.resolve(__dirname, './src/main.js')
  },
  output: {
    path: path.resolve(__dirname, './dist'),
    filename: 'js/[name].[hash:8].js', //打包到指定目录
    chunkFilename: 'js/[name].[hash:8].js'
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        use: 'happypack/loader?id=happyBabel', //开启happypack

        exclude: /node_modules/ //忽略Node_modules
      },
      {
        test: /\.vue$/,
        use: [
          'cache-loader',
          'thread-loader',
          {
            loader: 'vue-loader',

            options: {
              include: [path.resolve(__dirname, 'src')],
              exclude: /node_modules/,
              compilerOptions: {
                preserveWhitespace: false //去掉空格
              }
            }
          }
        ]
      },

      {
        test: /\.css$/,
        use: [
          {
            loader: devMode ? 'vue-style-loader' : MiniCssExtractPlugin.loader, // 生产环境把css文件从js文件抽离出来
            options: {
              name: 'css/[name].[hash:8].[ext]',
              filename: 'css/[name].[hash:8].[ext]',
              chunkFilename: '[id].css',

              hmr: devMode
            }
          },
          { loader: 'css-loader' },
          {
            loader: 'postcss-loader',
            options: {
              plugins: [require('autoprefixer')]
            }
          }
        ]
      },
      {
        test: /\.less$/,
        use: [
          {
            loader: devMode ? 'vue-style-loader' : MiniCssExtractPlugin.loader,
            options: {
              name: 'css/[name].[hash:8].[ext]',
              filename: 'css/[name].[hash:8].[ext]',
              chunkFilename: '[id].css',

              hmr: devMode
            }
          },
          { loader: 'css-loader' },

          {
            loader: 'postcss-loader',
            options: {
              plugins: [require('autoprefixer')]
            }
          },
          { loader: 'less-loader', options: { javascriptEnabled: true } }
        ]
      },
      {
        test: /\.(png|jpg|jpeg|gif|svg)$/,
        loader: 'url-loader',
        options: {
          limit: 10240,
          esModule: false,
          fallback: {
            // 超过10240的大文件做的操作,图片太大时就应该使用file-loader
            loader: 'file-loader',
            options: { esModule: false, name: 'img/[name].[hash:8].[ext]' }
          }
        }
      },
      {
        test: /\.(mp4|webm|ogg|mp3|wav|flac|aac)(\?.*)?$/,
        use: {
          loader: 'url-loader',
          options: {
            limit: 10240,
            fallback: {
              loader: 'file-loader',
              options: {
                name: 'media/[name].[hash:8].[ext]'
              }
            }
          }
        }
      },
      {
        test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/i,
        loader: 'url-loader',
        options: {
          //   esModule: false, // 该项默认为true，改为false即可
          limit: 10240,
          fallback: {
            // 超过10240的大文件做的操作,图片太大时就应该使用file-loader
            loader: 'file-loader',
            options: {
              publicPath: '../',
              name: 'font/[name].[hash:8].[ext]'
            }
          }
        }
      }
    ]
  },
  resolve: {
    alias: {
      vue$: 'vue/dist/vue.runtime.esm.js',
      '@': path.resolve(__dirname, './src'),
      Components: path.resolve('src/components'),
      Assets: path.resolve('src/assets')
    },
    extensions: ['*', '.js', '.json', '.vue']
  },

  plugins: [
    new CleanWebpackPlugin(),

    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, 'public/index.html'),
      baseUrl: './'
    }),
    // new PurgecssPlugin({ // 此处为css treeshaking，但是会影响第三方包的css加载
    //   paths: glob.sync(`${path.join(__dirname, "src")}/**/*.css`, { nodir: true }) // 不匹配目录，只匹配文件
    // }),
    new vueLoaderPlugin(),

    new MiniCssExtractPlugin({
      filename: devMode ? 'css/[name].css' : 'css/[name].[hash].css',
      chunkFilename: devMode
        ? 'css/[name].[id].css'
        : 'css/[name].[id].[hash].css' //如果是index间接引用就是实用到chunk
    }),
    new CopyWebpackPlugin([
      {
        from: path.resolve(__dirname, './public'),
        to: path.resolve(__dirname, './dist')
      }
    ]),

    //拷贝静态资源
    new HappyPack({
      //用id来标识 happypack处理那里类文件
      id: 'happyBabel',
      //如何处理  用法和loader 的配置一样
      loaders: [
        {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env'],
            cacheDirectory: true
          }
        }
      ],
      //共享进程池
      threadPool: happyThreadPool,
      //允许 HappyPack 输出日志
      verbose: true
    })
  ]
};
