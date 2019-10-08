const Create = () => import('@/views/note/create/index.vue');

export default [
  {
    path: '/note/create',
    name: 'note.create',
    component: Create
  },
  {
    path: '/note/edit/:id',
    name: 'note.edit',
    component: Create
  }
];
