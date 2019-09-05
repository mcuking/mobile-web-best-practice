import Vue from 'vue';
import Router from 'vue-router';
import RouterList from './router-list';
import LocalConfig from '@/config.json';

Vue.use(Router);

export default new Router({
  mode: LocalConfig.RouterMode as RouterMode,
  base: LocalConfig.RouterBase,
  routes: RouterList
});
