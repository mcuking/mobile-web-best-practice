import note from './module/note';
import notebook from './module/notebook';

const Home = () => import('@/views/home/index.vue');
const Quote = () => import('@/views/quote/index.vue');

export default [
  {
    path: '/',
    redirect: '/home'
  },
  {
    path: '/home',
    name: 'home',
    component: Home
  },
  {
    path: '/quote',
    name: 'quote',
    component: Quote
  },
  ...note,
  ...notebook
];
