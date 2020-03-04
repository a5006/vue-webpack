# 
这个项目是基于webpack 配置的vue脚手架
## Project setup
```
安装
npm install
```

### Compiles and hot-reloads for development
```
启动
npm run dev
```

### Compiles and minifies for production
```
npm run build
```

### dll plugin打包
```
npm run dll
```
打包好后记得在index.html 引入第三包
```html
<script src="static/js/vendor.dll.js"></script>

```

## 本脚手架提供的功能
除了基础的vue编译,js压缩css压缩热更新还有以下功能：

1. happypack 多线程打包
2. dll plugin 加快打包
3. js treeshaking
4. splitchunk 分离第三方包
5. gzip压缩
6. preload和prefetch 功能，如果想加快首屏渲染，建议不启用prefetch
7. cache-loader缓存
8. boundle-analyzer打包分析
## 对比vue cli3.0 

我在vue.config.js里面也通过配置splitchunk,prefetch等操作加快首屏速度和减少boundle包大小
在我自己配完这个webpack后也进行了对比，发现其实并没有很大的区别，跟vuecli 打出的包只有几kb的差异
反而在构建速度和打包速度上，是优于无配置优化的vuecli 
