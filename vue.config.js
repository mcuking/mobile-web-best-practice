const webpack = require('webpack');
const NODE_ENV = process.env.NODE_ENV || 'development';
const IS_DEV = NODE_ENV === 'development';
const SentryPlugin = require('@sentry/webpack-plugin');
const LodashModuleReplacementPlugin = require('lodash-webpack-plugin');
const version = require('./package.json').version;

const plugins = [
  new LodashModuleReplacementPlugin(),
  new webpack.DefinePlugin({
    __VERSION__: JSON.stringify(version)
  })
];

if (!IS_DEV) {
  // 由于国内访问 sentry 官网网络不稳定，所以关闭自动上传 map 文件插件
  // plugins.push(
  //   new SentryPlugin({
  //     release: version,
  //     include: './dist/js',
  //     urlPrefix: '~/js/',
  //     ignore: ['node_modules']
  //   })
  // );
}

module.exports = {
  outputDir: 'dist/',
  publicPath: IS_DEV ? '/' : './',
  productionSourceMap: !IS_DEV,
  css: {
    extract: false,
    loaderOptions: {
      less: {
        modifyVars: {
          'button-primary-background-color': '#1989fa',
          'button-primary-border-color': '#1989fa'
        }
      }
    }
  },
  configureWebpack: {
    entry: './src/main.ts',
    output: {
      libraryExport: 'default'
    },
    externals: {
      vue: 'Vue',
      moment: 'moment'
    },
    plugins
  }
};
