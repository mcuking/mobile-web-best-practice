const path = require('path');
const webpack = require('webpack');
const SentryPlugin = require('@sentry/webpack-plugin');
const LodashModuleReplacementPlugin = require('lodash-webpack-plugin');
const PrerenderSPAPlugin = require('prerender-spa-plugin');
const Renderer = PrerenderSPAPlugin.PuppeteerRenderer;
const version = require('./package.json').version;
const LocalConfig = require('./src/config.json');

const NODE_ENV = process.env.NODE_ENV || 'development';
const IS_PRO = NODE_ENV === 'production';

const commonPlugins = [
  new webpack.DefinePlugin({
    __VERSION__: JSON.stringify(version)
  })
];

module.exports = {
  publicPath: IS_PRO ? './' : '/',
  productionSourceMap: IS_PRO,
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
  configureWebpack: () => {
    if (IS_PRO) {
      const productionPlugins = [new LodashModuleReplacementPlugin()];
      if (LocalConfig.SentryEnabled && LocalConfig.SentryPluginEnabled) {
        productionPlugins.push(
          new SentryPlugin({
            release: version, //发布的版本
            include: path.join(__dirname, './dist/js'), //需要上传到sentry服务器的资源目录,会自动匹配 js 以及 map 文件
            urlPrefix: '~/mobile-web-best-practice/js', //线上对应的 url 资源的相对路径
            ignore: ['node_modules'] //忽略文件目录, 当然我们在 inlcude 中制定了文件路径,这个忽略目录可以不加
          })
        )
      }

      if (LocalConfig.PreRenderEnabled) {
        productionPlugins.push(
          new PrerenderSPAPlugin({
            staticDir: path.join(__dirname, 'dist'),
            routes: ['/'], //需要预渲染的路由
            renderer: new Renderer({
              headless: false, //打包渲染时是否显示浏览器窗口，调试时有用
              renderAfterDocumentEvent: 'render-event' //等待触发目标时间后，开始预渲染
            })
          })
        )
      }

      return {
        plugins: [...commonPlugins, ...productionPlugins],
        externals: {
          vue: 'Vue',
          moment: 'moment'
        }
      }
    } else {
      return {
        plugins: [...commonPlugins],
      }
    }
  }
};