<template>
	<div class="mainDiv">
    <van-nav-bar left-text="退款" right-text="退款记录" left-arrow @click-left="onClickLeft" @click-right="onClickRight"/>
		<div class="contentDiv mt-15 mb-15 ml-15 mr-15 pt-15 pb-15 pl-35 pr-35">
      <div class="f-18 colorText3 mt-20 tl">退款金额</div>
      <div class="f-18 colorText3 mt-20 tl">
        <span class="f-30">¥</span>
        <input type="number" class="ml-15" style="border-width: 0px" v-model="inputMoneyVal"/>
      </div>
      <div class="flex-line-h mt-10" />
      <div class="f-14 colorText3 mt-10 tl">当前余额:{{myRemainMoney | yuan}}元,<span class="colorTheme ml-10" @click="inputMoneyVal = myRemainMoney">全部退款</span></div>
      <div class="tl pt-30">
        <div class="colorText3 f-18">请选择支付方式</div>
        <div v-if="paymentModeList && paymentModeList.length > 0">
          <div v-for="(item, index) in paymentModeList" :key="index">
            <div class="flex-line-h mt-10 mb-10 ml-20 mr-20" v-if="0 != index"/>
            <div class="dl garage-bottom mt-15" @click="selectPayCode = item.payCode">
              <div class="dl">
                <img :src="('wechat_pay' == item.payCode || 'app_weixin' == item.payCode) ? imgPayIconWechat : imgPayIconAlipay" width="13" height="13" class="ml-15"/>
                <span class="ml-5">{{item.payName}}</span>
              </div>
              <img :src="selectPayCode == item.payCode ? imgRadioSelected : imgRadioUnSelect" width="13" height="13" class="mr-15 pr" style="top: 4px;"/>
            </div>
          </div>
        </div>
        <div class="colorTextG f-10 mt-10" v-else>暂无</div>
      </div>
      <van-button type="danger" size="normal" class="bgTheme colorText f-16 mt-40" style="width: 100%" @click="commitRefundMoneyApply()">提交退款</van-button>
		</div>
	</div>
</template>

<script>
import imgPayIconWechat from '@/assets/images/icon-info-wechat.png';
import imgPayIconAlipay from '@/assets/images/icon-info-alipay.png';
import imgRadioSelected from '@/assets/images/icon-radio-selected.png';
import imgRadioUnSelect from '@/assets/images/icon-radio-unselect.png';
import api from '@/api';
import ComponentUtil from '@/utils/componentUtil';

export default {
  name: 'tempStopQr',
  data() {
    return {
      imgPayIconWechat,
      imgPayIconAlipay,
      imgRadioSelected,
      imgRadioUnSelect,
      myRemainMoney: 0,
      imgRadioSelected,
      imgRadioUnSelect,
      myRemainMoney: 0,
      inputMoneyVal: '',
      paymentModeList: [],
      selectPayCode: null
    };
  },
  methods: {
    onClickLeft() {
      history.go(-1);
    },
    onClickRight() {
      this.$router.push({ path: '/recordDataList', query:{ recordFlag: 0 } });
    },
    commitRefundMoneyApply() {
      if (!this.inputMoneyVal || this.inputMoneyVal <= 0) {
        this.$toast('请输入退款金额且必须大于0');
        return;
      } // end of if
      if (this.inputMoneyVal > this.myRemainMoney) {
        this.$toast('输入的退款金额不能大于当前余额');
        return;
      } // end of if
      if (!this.selectPayCode) {
        this.$toast('请选择退款金额支付方式');
        return;
      } // end of if
      api.user.commitRefundMoney({ cashMoney: this.inputMoneyVal, payCode: this.selectPayCode }).then(data => {
        this.$toast('发起退款申请成功!');
        setTimeout(() => {
          ComponentUtil.updateLoginUserMoneyData(remainMoney => {
            this.myRemainMoney = remainMoney;
            history.go(-1);
          });
        }, 1500);
      });
    },
    initGetMainListData() {
      api.user.getPayMethodList({ type: 'wechat' }).then(data => {
        if (data && data.length > 0) {
          this.paymentModeList = data;
          this.selectPayCode = this.paymentModeList[0].payCode;
        } // end of if
      });
    }
  },
  mounted() {
    ComponentUtil.updateLoginUserMoneyData(remainMoney => {
      this.myRemainMoney = remainMoney;
    });
    // this.initGetMainListData();
  }
};
</script>

<style lang="scss" scoped>
.mainDiv{
  background-color: #F2F1F1;
}
.contentDiv{
  text-align: center;
  background: #fff;
  border-radius: 8px;
  .flex-line-h{
    height: 1px;
    background-color: #F2F1F1;
  }
  .garage-bottom{
    display: flex;
    justify-content: space-between;
    padding-left: 10px;
    padding-right: 10px;
    span{
      vertical-align: middle;
    }
    img{
      vertical-align: middle;
    }
  }
}
</style>
