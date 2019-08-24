import Vue from 'vue';
import bus from './bus';

export default {
  install(vue: typeof Vue) {
    Object.defineProperty(vue.prototype, '$bus', {
      get: () => bus
    });
  }
};
