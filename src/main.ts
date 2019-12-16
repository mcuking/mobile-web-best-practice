import Vue from 'vue';
import VuePageStack from 'vue-page-stack';
import { Toast, Dialog } from 'vant';
import VueBetterScroll from 'vue2-better-scroll';

import App from './App.vue';
import router from './router';
import Report from './utils/report';
import GlobalMethods from './utils/global-method';
import initMockService from '@/mocks';
import { initPlatform } from '@/utils/common-tools';
import Directives from '@/directives';
import LocalConfig from '@/config.json';

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

if (LocalConfig.MockEnabled) {
  initMockService();
}

initPlatform();

Vue.config.productionTip = false;

Vue.use(GlobalMethods)
  .use(Directives)
  .use(Toast)
  .use(Dialog)
  .use(VueBetterScroll);

if (LocalConfig.VuePageStackEnabled) {
  Vue.use(VuePageStack, { router });
}

new Vue({
  router,
  render: (h) => h(App),
  mounted() {
    if (LocalConfig.PreRenderEnabled) {
      // 触发 renderAfterDocumentEvent
      document.dispatchEvent(new Event('render-event'));
    }
  }
}).$mount('#app');
