import bus from './bus';

export default {
  install(Vue: any) {
    Object.defineProperty(Vue.prototype, '$bus', {
      get: () => bus,
    });
  },
};
