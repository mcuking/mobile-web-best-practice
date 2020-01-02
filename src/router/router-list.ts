const Home = () => import('@/views/home/index.vue');
const NotebookCreate = () => import('@/views/notebook/create/index.vue');
const NoteCreate = () => import('@/views/note/create/index.vue');
const Quote = () => import('@/views/quote/index.vue');

export default [
  {
    path: '/',
    redirect: '/home'
  },
  {
    path: '/home',
    name: 'home',
    component: Home,
    children: [
      {
        path: 'notebook/create',
        name: 'notebook.create',
        component: NotebookCreate
      },
      {
        path: 'note/create',
        name: 'note.create',
        component: NoteCreate,
        children: [
          {
            path: 'quote',
            name: 'quote',
            component: Quote
          }
        ]
      }
    ]
  }
];
