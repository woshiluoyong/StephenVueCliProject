<template>
	<van-tabbar v-model="active" style="z-index: 1999">
		<van-tabbar-item v-for="(tab, index) in tabbar" :to="tab.path" :dot="tab.dot" :info="tab.info" :key="index">
      <img slot="icon" slot-scope="props" :src="props.active ? tab.iconSelect : tab.iconNormal"/>
			{{tab.name}}
		</van-tabbar-item>
	</van-tabbar>
</template>


<script>
import { Tabbar, TabbarItem } from 'vant';
import tabHomeImg from '@/assets/images/tab-home.png';
import tabHomeImgFocus from '@/assets/images/tab-home-focus.png';
import tabOrderImg from '@/assets/images/tab-order.png';
import tabOrderImgFocus from '@/assets/images/tab-order-focus.png';
import tabMineImg from '@/assets/images/tab-mine.png';
import tabMineImgFocus from '@/assets/images/tab-mine-focus.png';

export default {
  components: {
    [Tabbar.name]: Tabbar,
    [TabbarItem.name]: TabbarItem
  },
  data() {
    return {
      active: 0,
      tabbar: [
        {
          name: '首页',
          path: '/',
          pathName: 'home',
          icon: 'compass-full',
          iconNormal: tabHomeImg,
          iconSelect: tabHomeImgFocus,
          dot: false,
          info: ''
        },
        {
          name: '订单',
          path: '/order',
          pathName: 'order',
          icon: 'class-full',
          iconNormal: tabOrderImg,
          iconSelect: tabOrderImgFocus,
          dot: false,
          info: ''
        },
        {
          name: '我的',
          path: '/user',
          pathName: 'user',
          icon: 'wode',
          iconNormal: tabMineImg,
          iconSelect: tabMineImgFocus,
          dot: false,
          info: ''
        }
      ]
    };
  },
  watch: {
    $route: 'changeActive'
  },
  created() {
    const toName = this.$route.name;
    this.setActive(toName);
  },
  methods: {
    changeActive({ name }) {
      this.setActive(name);
    },
    setActive(name) {
      this.tabbar.forEach((tab, i) => {
        if (tab.pathName == name) {
          this.active = i;
          return false;
        } // end of if
      });
    }
  }
};
</script>
