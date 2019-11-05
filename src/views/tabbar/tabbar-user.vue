<template>
  <div class="mainDiv">
    <van-nav-bar title="我的"/>
    <van-pull-refresh v-model="isRefreshing" @refresh="onRefresh">
      <div class="contentDiv mb-15">
        <div class="top-title pt-35 pl-20" :style="{backgroundImage:`url(${imgTopHeadBg})`}">
          <van-uploader :after-read="onImgAfterRead" style="top:5px;">
            <img :src="ViewImgUrl + curUserInfo.headUrl" width="70" height="70" class="headImg dl" v-if="curUserInfo.headUrl"/>
            <img src="../../assets/images/img-default-head.png" width="70" height="70" class="headImg dl" v-else/>
          </van-uploader>
          <div class="dl ml-15">
            <div class="f-16 c-white mb-10">{{curUserInfo.phone}}</div>
            <div class="f-10 c-white">临停卡号:{{curUserInfo.tempIcNo ? curUserInfo.tempIcNo : '暂无'}}</div>
          </div>
        </div>
        <div class="bgWhiteColor pt-10 pb-10"/>
        <van-cell-group>
          <van-cell title="余额" :value="this.curUserInfo.remainMoney + '元'" is-link @click="goToBalance()">
            <img slot="icon" src="../../assets/images/icon-mine-money.png" width="18" height="18" class="pr mr-10" style="top: 3px;"/>
          </van-cell>
          <van-cell title="充值" value="" is-link @click="goToRecharge()">
            <img slot="icon" src="../../assets/images/icon-mine-recharge.png" width="18" height="18" class="pr mr-10" style="top: 3px;"/>
          </van-cell>
        </van-cell-group>
      </div>
    </van-pull-refresh>
  </div>
</template>

<script>
import api from '@/api';
import global from '@/utils/globalVar';
import sysConfig from '@/utils/config';
import { loginUserInfo } from '@/utils/jsLocalS'
import imgTopHeadBg from '@/assets/images/img-top-head-bg.png';

export default {
  data() {
    return {
      imgTopHeadBg,
      curUserInfo: {},
      isRefreshing: false
    };
  },
  computed: {
    ViewImgUrl: () => {
      return sysConfig.getImgAddress();
    }
  },
  methods: {
    onRefresh() {
      this.getLoginUserInfoData();
    },
    onImgAfterRead(picFile) {
      api.user.uploadUserHead({ file: picFile.file }).then(data => {
        if (data && data.fileName) {
          this.updateUserHeadInfo(data.fileName);
        } else {
          this.$toast('上传头像失败!');
        }
      });
    },
    goToBalance() {
      this.$router.push({ path: '/mineBalance' });
    },
    goToRecharge() {
      this.$router.push({ path: '/mineRecharge' });
    },
    updateUserHeadInfo(headUrl) {
      api.user.updateUserInfo({ headUrl }).then(data => {
        this.$toast('更新头像成功!');
        this.curUserInfo.headUrl = headUrl;
      });
    },
    getLoginUserInfoData() {
      this.isRefreshing = true;
      api.user.getUserInfo({ id: global.userInfoObj.id }).then(data => {
        this.isRefreshing = false;
        if (data) {
          data.token = global.userInfoObj.token;
          data.remainMoney = data.remainMoney || 0;
          global.setUserInfoObj(data);
          loginUserInfo.setLoginUserInfo(JSON.stringify(data));
          this.curUserInfo = global.userInfoObj;
        } // end of if
      }).catch(err => {
        this.isRefreshing = false;
      });
    }
  },
  mounted() {
    if (global.userInfoObj) this.curUserInfo = global.userInfoObj;
    // this.getLoginUserInfoData();
  }
};
</script>

<style lang="scss" scoped>
.mainDiv{
  background-color: #ffffff;
}
.contentDiv{
  background: #F2F1F1;
  height: calc(100vh - 92px);
  padding-bottom: 10px;
  overflow-y: scroll;
  .top-title{
    width: 100%;
    height: 150px;
    background-color: white;
    background-repeat: no-repeat;
    background-size: 100% 100%;
    .headImg{
      border-radius: 5px;
    }
  }
}
</style>
