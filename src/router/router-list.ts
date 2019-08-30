export default [
  {
    path: '/',
    name: 'entry',
    component: () => import('@/views/entry/index.vue')
  },
  {
    path: '/form',
    name: 'form',
    component: () => import('@/views/form/index.vue')
  },
  {
    path: '/info-list',
    name: 'info-list',
    component: () => import('@/views/infoList/index.vue')
  }
];
