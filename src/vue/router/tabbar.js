const Tabbar = () => import(/* webpackChunkName: "Tabbar" */ '@/vue/components/Tabbar/');
import asyncLoader from '@/utils/async-loader';

export default [
  {
    path: '/',
    name: 'home',
    meta: { keepAlive: true },
    components: {
      default: asyncLoader('tabbar/tabbar-home'),
      tabbar: Tabbar
    }
  },
  {
    path: '/order',
    name: 'order',
    meta: { needLogin: false, keepAlive: true },//needLogin 用于判断是否需要检查登录与否
    components: {
      default: asyncLoader('tabbar/tabbar-order'),
      tabbar: Tabbar
    }
  },
  {
    path: '/user',
    name: 'user',
    meta: { needLogin: false, keepAlive: true },
    components: {
      default: asyncLoader('tabbar/tabbar-user'),
      tabbar: Tabbar
    }
  },
  {
    path: '*',
    redirect: { name: 'home' }
  }
];
