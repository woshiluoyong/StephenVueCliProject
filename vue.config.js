const path = require('path');

function resolve(dir = '') {
  return path.join(__dirname, './src', dir);
}

module.exports = {
  publicPath: './',
  productionSourceMap: false,
  devServer: {
    proxy: { // 调试的时候配置跨域,不需要可以直接注释掉
      '/api': {
        target: 'http://120.xx.xx.xx:8888',
        changeOrigin: true,
        pathRewrite: {
          '^/api': '/api' //本身的接口地址没有 '/api' 这种通用前缀，所以要rewrite，如果本身有则去掉
        }
      }
    }
  },
  chainWebpack: config => {
    config.plugins.delete('prefetch');
    config.plugins.delete('preload');
  },
  configureWebpack: {
    resolve: {
      alias: {
        core: resolve('core')
      }
    },
    optimization: {
      runtimeChunk: {
        name: entrypoint => `runtime~${entrypoint.name}`
      },
      splitChunks: {
        minChunks: 2,
        minSize: 20000,
        maxAsyncRequests: 20,
        maxInitialRequests: 30,
        name: false
      }
    }
  },
  pluginOptions: {// 第三方插件配置
    pwa: {
      iconPaths: {
        favicon32: './favicon.ico',
        favicon16: './favicon.ico',
        appleTouchIcon: './favicon.ico',
        maskIcon: './favicon.ico',
        msTileImage: './favicon.ico'
      }
    },
  },
  css: {
    loaderOptions: {
      sass: {
        data:
          '@import "@/assets/scss/_var.scss";@import "@/assets/scss/_mixin.scss";'
      }
    }
  }
};
