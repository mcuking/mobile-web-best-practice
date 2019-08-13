export default [
  {
    path: '/',
    redirect: '/form'
  },
  {
    path: '/form',
    name: 'form',
    component: () => import('@/views/form/index.vue')
  },
  {
    path: '/date-picker',
    name: 'date-picker',
    component: () => import('@/views/datePicker/index.vue')
  }
];
