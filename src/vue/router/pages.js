import asyncLoader from '@/utils/async-loader';

export default [
  {
    path: '/bindPhone',
    name: 'bindPhone',
    component: asyncLoader('login/login')
  },
  {
    path: '/tempStopQr',
    name: 'tempStopQr',
    meta: { needLogin: false },
    component: asyncLoader('pages/tempStopQr')
  },
  {
    path: '/searchGarage',
    name: 'searchGarage',
    meta: { needLogin: false },
    component: asyncLoader('pages/searchGarage')
  },
  {
    path: '/selectGarage',
    name: 'selectGarage',
    meta: { needLogin: false },
    component: asyncLoader('pages/selectGarage')
  },
  {
    path: '/confirmStop',
    name: 'confirmStop',
    meta: { needLogin: true },
    component: asyncLoader('pages/confirmStop')
  },
  {
    path: '/orderDetails',
    name: 'orderDetails',
    meta: { needLogin: false },
    component: asyncLoader('pages/orderDetails')
  },
  {
    path: '/mineBalance',
    name: 'mineBalance',
    meta: { needLogin: false },
    component: asyncLoader('pages/mineBalance')
  },
  {
    path: '/mineRecharge',
    name: 'mineRecharge',
    meta: { needLogin: false },
    component: asyncLoader('pages/mineRecharge')
  },
  {
    path: '/mineRefund',
    name: 'mineRefund',
    meta: { needLogin: false },
    component: asyncLoader('pages/mineRefund')
  },
  {
    path: '/recordDataList',
    name: 'recordDataList',
    meta: { needLogin: false },
    component: asyncLoader('pages/recordDataList')
  }
];
