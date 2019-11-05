import Vue from 'vue';
import App from './App.vue';
import router from './vue/router';
import Vconsole from 'vconsole';
import global from '@/utils/globalVar'
import './assets/scss/global.scss';
import '@/assets/scss/iconfont/iconfont.css';

import VueCountdown from '@/vue/plugins/vue-countdown';
import axios from '@/vue/plugins/axios';
import filters from '@/vue/filter';

Vue.use(VueCountdown);
Vue.use(axios);
Vue.use(filters);

import { NavBar, Lazyload, Icon, Cell, CellGroup, loading, Button, Toast, Dialog, Checkbox,
  RadioGroup, Radio, Popup, Search, Tab, Tabs, CountDown, PullRefresh, List, Uploader } from 'vant';
Vue.use(NavBar);
Vue.use(Icon);
Vue.use(Cell);
Vue.use(CellGroup);
Vue.use(loading);
Vue.use(Button);
Vue.use(Toast);
Vue.use(Dialog);
Vue.use(Checkbox);
Vue.use(RadioGroup);
Vue.use(Radio);
Vue.use(Popup);
Vue.use(Search);
Vue.use(Tab).use(Tabs);
Vue.use(CountDown);
Vue.use(PullRefresh);
Vue.use(List);
Vue.use(Uploader);
Vue.use(Lazyload, {
  preLoad: 1.3,
  error: require('@/assets/images/goods_default.png'),
  loading: require('@/assets/images/goods_default.png'),
  attempt: 1,
  listenEvents: ['scroll'],
  lazyComponent: true
});

//debug
//Vue.use(new Vconsole());

Vue.config.productionTip = false; // 去掉生产console使用vue警告
global.setRouterObj(router); // 方便有些地方可以push跳转页面

new Vue({
  router,
  render: h => h(App)
}).$mount('#app');
