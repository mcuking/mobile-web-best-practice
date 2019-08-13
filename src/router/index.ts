import Vue from 'vue';
import Router from 'vue-router';
import RouterList from './router-list';

Vue.use(Router);

export default new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: RouterList,
});
