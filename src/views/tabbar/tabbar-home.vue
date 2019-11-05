<template>
	<div class="tab_home b-white pl-10 pt-10 pr-10 pb-10">
    <div class="top-info colorText3 f-14">亲爱的{{topWelcomeInfo}}用户，您好!</div>
    <img src="../../assets/images/img-home-card-temp.png" alt="temp" width="100%" height="190" class="mt-15" @click="toEntryStop(true)"/>
    <img src="../../assets/images/img-home-card-month.png" alt="month" width="100%" height="190" class="mt-15" @click="toEntryStop(false)"/>
	</div>
</template>

<script>
import PubSub from 'pubsub-js';
import api from '@/api';
import global from '@/utils/globalVar';
import { mainBaseData } from '@/utils/jsLocalS';

let loadBaseDataCount = 0;

export default {
  data() {
    return {
      topWelcomeInfo: ''
    };
  },
  methods: {
    toEntryStop(isTemp) {
      if(isTemp){
        this.$router.push({ path: '/tempStopQr' });
      }else{
        this.$dialog.alert({ message: '目前微信端操作只支持临时停车，月卡停车用户请下载app操作!' });
      }
    },
    initGetMainBaseData(isHas) {
      api.user.getSysInfo(!isHas).then(data => {
        if (data) {
          data.diffTime = (global.mainBaseData.serverTime - (new Date()).getTime());
          global.setMainBaseData(data);
          mainBaseData.setMainBaseData(JSON.stringify(data));
          if (!this.topWelcomeInfo) this.topWelcomeInfo = data.appName;
          console.log('=================>更新基本信息成功!');
        } else {
          this.reloadMainBaseInfo(isHas);
        }
      }).catch(err => {
        console.error('===========initGetMainBaseData======>err:', err);
        this.reloadMainBaseInfo(isHas);
      });
    },
    reloadMainBaseInfo(isHas) {
      if (!isHas) {
        loadBaseDataCount++;
        if (loadBaseDataCount >= 5) {
          this.$dialog.alert({ title: '严重错误', message: '必备重要信息多次加载失败,请关闭重新进入!' }).then(() => {});
          return;
        } // end of if
        this.initGetMainBaseData(isHas);
      } // end of if
    }
  },
  beforeDestroy() {
    PubSub.unsubscribe('refreshUserInfo');
  },
  mounted() {
    //用户信息
    if (global.userInfoObj) this.topWelcomeInfo = global.userInfoObj.phone;
    //基础信息
    loadBaseDataCount = 0;
    global.setMainBaseData({});
    const mainBaseDataObj = mainBaseData.getMainBaseData(true);
    if (mainBaseDataObj) {
      mainBaseDataObj.diffTime = 0;// (global.mainBaseData.serverTime - (new Date()).getTime());// 这里不能计算差值,存下来的可能是很久之前的服务器时间
      global.setMainBaseData(mainBaseDataObj);
      if (!this.topWelcomeInfo) this.topWelcomeInfo = mainBaseDataObj.appName;
      console.log('=================>目前已经有必须的基础信息了,');
      // this.initGetMainBaseData(true);
    } else {
      console.log('=================>目前没有必须的基础信息');
      // this.initGetMainBaseData(false);
    }
    PubSub.subscribe('refreshUserInfo', (msg) => {// msg没有用，但是必须得有(语法就是这么规定的)
      if (global.userInfoObj) this.topWelcomeInfo = global.userInfoObj.phone;
    });
  }
};
</script>

<style lang="scss" scoped>
</style>
