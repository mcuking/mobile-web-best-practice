import Vue from 'vue';
import App from './App.vue';
import router from './router';
import store from './store';
import VuePageStack from 'vue-page-stack';
import Report from './utils/report';
import GlobalMethods from './utils/global-method';
import initMockService from '@/mocks';
import { initPlatform } from '@/utils/tools';
import LocalConfig from '@/config.json';
import Directives from '@/directives';
import { Toast } from 'vant';

const IS_DEV = process.env.NODE_ENV === 'development';

if (LocalConfig.SentryEnabled && !IS_DEV) {
  const sentry = Report.getInstance(Vue, {
    dsn: LocalConfig.SentryDSN,
    release: __VERSION__, // from webpack DefinePlugin
    environment: 'Prod'
  });

  window.$sentry = sentry;

  // 全局监控 Vue errorHandler
  Vue.config.errorHandler = (error, vm, info) => {
    window.$sentry.log({
      error,
      type: 'vue errorHandler',
      vm,
      info
    });
  };
}

initPlatform();

initMockService();

Vue.config.productionTip = false;

Vue.use(Toast);
Vue.use(GlobalMethods);
Vue.use(Directives);

if (LocalConfig.VuePageStackEnabled) {
  Vue.use(VuePageStack, { router });
}

new Vue({
  router,
  store,
  render: (h) => h(App),
  mounted() {
    if (LocalConfig.PreRenderEnabled) {
      // 触发 renderAfterDocumentEvent
      document.dispatchEvent(new Event('render-event'));
    }
  }
}).$mount('#app');
