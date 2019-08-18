import Vue from 'vue';
import App from './App.vue';
import router from './router';
import store from './store';
import VuePageStack from 'vue-page-stack';
import Report from './utils/report';
import GlobalMethods from './utils/global-method';
import initMockService from '@/mocks';

const DSN = 'https://3ea4cc2c4ad34ba394a029034d4251d0@sentry.io/1527795';
const IS_DEV = process.env.NODE_ENV === 'development';

if (!IS_DEV) {
  const sentry = Report.getInstance(Vue, {
    dsn: DSN,
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

initMockService();

Vue.config.productionTip = false;

Vue.use(GlobalMethods);
Vue.use(VuePageStack, { router });

new Vue({
  router,
  store,
  render: (h) => h(App)
}).$mount('#app');
