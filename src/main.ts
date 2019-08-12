import Vue from 'vue';
import App from './App.vue';
import router from './router';
import store from './store';
import Report from './utils/report';

const VERSION = require('../package.json').version;
const DSN = 'https://3ea4cc2c4ad34ba394a029034d4251d0@sentry.io/1527795';
const IS_DEV = process.env.NODE_ENV === 'development';

if (!IS_DEV) {
  let sentry = Report.getInstance(Vue, {
    dsn: DSN,
    release: VERSION,
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

Vue.config.productionTip = false;

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app');
