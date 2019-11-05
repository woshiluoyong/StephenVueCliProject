<template>
	<div class="mainDiv">
    <van-nav-bar left-text="余额" left-arrow @click-left="onClickLeft"/>
		<div class="contentDiv">
      <img src="../../assets/images/img-balance-money.png" width="60" height="60" class="mt-40"/>
      <div class="f-16 colorText3 mt-20">我的余额</div>
      <div class="f-40 colorText3 mt-10"><b>{{myRemainMoney | yuan}}</b></div>
      <van-button type="danger" size="normal" class="bgTheme colorText f-16 mt-80" style="width: 90%" @click="goToRecharge()">充值</van-button>
      <van-button type="default" size="normal" class="bgGrayColor colorTheme f-16 mt-25" style="width: 90%" @click="goToRefund()">退款</van-button>
		</div>
	</div>
</template>

<script>
import api from '@/api'
import ComponentUtil from '@/utils/componentUtil';

export default {
  name: 'tempStopQr',
  data() {
    return {
      myRemainMoney: 0
    };
  },
  methods: {
    onClickLeft() {
      history.go(-1);
    },
    goToRecharge() {
      this.$router.push({ path: '/mineRecharge' });
    },
    goToRefund() {
      this.$router.push({ path: '/mineRefund' });
    }
  },
  mounted() {
    ComponentUtil.updateLoginUserMoneyData(remainMoney => {
      this.myRemainMoney = remainMoney;
    });
  }
};
</script>

<style lang="scss" scoped>
.mainDiv{
  background-color: #ffffff;
}
.contentDiv{
  text-align: center;
  height: calc(100vh - 130px);
  overflow-y: scroll;
}
</style>
