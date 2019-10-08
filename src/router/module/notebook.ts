const Create = () => import('@/views/notebook/create/index.vue');

export default [
  {
    path: '/notebook/create',
    name: 'notebook.create',
    component: Create
  },
  {
    path: '/notebook/edit/:id',
    name: 'notebook.edit',
    component: Create
  }
];
