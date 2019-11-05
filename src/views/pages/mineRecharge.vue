<template>
	<div class="mainDiv">
    <van-nav-bar left-text="充值" right-text="充值记录" left-arrow @click-left="onClickLeft" @click-right="onClickRight"/>
		<div class="contentDiv">
      <div class="tl pt-30 pl-20 pr-20">
        <div class="f-16 colorText3">余额：{{myRemainMoney}}元</div>
        <div class="df mt-25">
          <div class="df-1 dl tc" :class="{ 'money-item': payMoneyIndex != 0, 'money-item-select': payMoneyIndex == 0 }" @click="payMoneyIndex = 0">
            <span class="f-16">5元</span>
          </div>
          <div class="df-1 dl tc ml-15 mr-15" :class="{ 'money-item': payMoneyIndex != 1, 'money-item-select': payMoneyIndex == 1 }" @click="payMoneyIndex = 1">
            <span class="f-16">10元</span>
          </div>
          <div class="df-1 dl tc" :class="{ 'money-item': payMoneyIndex != 2, 'money-item-select': payMoneyIndex == 2 }" @click="payMoneyIndex = 2">
            <span class="f-16">20元</span>
          </div>
        </div>
        <div class="df mt-15">
          <div class="df-1 dl tc" :class="{ 'money-item': payMoneyIndex != 3, 'money-item-select': payMoneyIndex == 3 }" @click="payMoneyIndex = 3">
            <span class="f-16">50元</span>
          </div>
          <div class="df-1 dl tc ml-15 mr-15" :class="{ 'money-item': payMoneyIndex != 4, 'money-item-select': payMoneyIndex == 4 }" @click="payMoneyIndex = 4">
            <span class="f-16">100元</span>
          </div>
          <div class="df-1 dl tc" :class="{ 'money-item': payMoneyIndex != 5, 'money-item-select': payMoneyIndex == 5 }" @click="payMoneyIndex = 5">
            <span class="f-16">其他金额</span>
          </div>
        </div>
        <div class="f-16 colorText3 mt-25" v-if="5 == payMoneyIndex">
          <div class="dl" style="width:37%">请输入充值金额</div>
          <input type="number" v-model="inputMoneyVal" style="border-top-width: 0px; border-left-width: 0px; border-right-width: 0px; border-bottom-color: #E5E5E5; border-bottom-width: 1px; width: 63%"/>
        </div>
      </div>
      <div class="tl pt-30 pl-20 pr-20">
        <div class="colorText3 f-15">请选择支付方式</div>
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
        <div class="colorTextG f-13 mt-10" v-else>暂无</div>
      </div>
      <van-button type="danger" size="normal" class="bgTheme colorText f-16 mt-80" style="width: 90%" @click="commitRechargeMoneyApply()">确认并支付</van-button>
		</div>
	</div>
</template>

<script>
import imgPayIconWechat from '@/assets/images/icon-info-wechat.png';
import imgPayIconAlipay from '@/assets/images/icon-info-alipay.png';
import imgRadioSelected from '@/assets/images/icon-radio-selected.png';
import imgRadioUnSelect from '@/assets/images/icon-radio-unselect.png';
import api from '@/api';
import global from '@/utils/globalVar';
import ComponentUtil from '@/utils/componentUtil';
import WxPaymentUtil from '@/utils/wxPaymentUtil';

const selectMoneyAry = [5, 10, 20, 50, 100];

export default {
  name: 'tempStopQr',
  data() {
    return {
      imgPayIconWechat,
      imgPayIconAlipay,
      imgRadioSelected,
      imgRadioUnSelect,
      myRemainMoney: 0,
      payMoneyIndex: 0,
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
      this.$router.push({ path: '/recordDataList', query:{ recordFlag: 1 } });
    },
    commitRechargeMoneyApply() {//生成预付单
      if (!this.selectPayCode) {
        this.$toast('请选择充值支付方式');
        return;
      } // end of if
      let tmpMoneyVal = -1;
      if (5 == this.payMoneyIndex) {
        if (!this.inputMoneyVal || this.inputMoneyVal <= 0) {
          this.$toast('请输入充值金额且必须大于0!');
          return;
        } // end of if
        /* if (!ComponentUtil.isInteger(this.inputMoneyVal)) {
          this.$toast('充值金额必须是整数!');
          return;
        } // end of if */
        tmpMoneyVal = this.inputMoneyVal;
      } else {
        if (this.payMoneyIndex >= 0 && this.payMoneyIndex < selectMoneyAry.length) tmpMoneyVal = selectMoneyAry[this.payMoneyIndex];
      }
      if (-1 == tmpMoneyVal) {
          this.$toast('充值金额异常,请重试!');
          return;
      } // end of if
      api.user.getCreatePrePay({ channel: this.selectPayCode, payMoney: tmpMoneyVal }).then(data => {
        this.$toast('生成预付单成功,开始支付!');
        this.commitRechargeMoneyPay(data, tmpMoneyVal);
      });
    },
    commitRechargeMoneyPay(orderData, payMoney) {// 发起支付
      if ('wechat_pay' == this.selectPayCode || 'app_weixin' == this.selectPayCode) {
        if(!orderData.appId && global.mainBaseData)orderData.appId = global.mainBaseData.appId;
        WxPaymentUtil.payment(orderData, success => {
          console.log('===========>微信支付成功回调', success);
          this.$toast('微信付款成功,验证中...');
          setTimeout(() => this.commitRechargeMoneyNext(orderData.payOrderFormNo), 2000);
        }, error => {
          console.log('===========>微信支付失败回调', error);
          this.$toast('微信付款取消或失败,请重试!');// + (error ? '(' + error.msg + ')' : ''));
        });
      } else {
        this.$toast('选择的支付方式暂不支持!');
      }
    },
    commitRechargeMoneyNext(orderNo) {// 支付完成下一步,确认支付结果
      api.user.confirmPayOrder({ orderNo }).then(data => {
        this.$toast('充值成功!');
        ComponentUtil.updateLoginUserMoneyData(remainMoney => {
          this.myRemainMoney = remainMoney;
          history.go(-1);
        });
        /* if (this.props.navigation.state.params) this.props.navigation.state.params.refresh();
        this.props.navigation.goBack(); */
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
    if(this.$route.query && this.$route.query.enterFlag == 'balanceNotEnough' && global.otherBaseData && global.otherBaseData.secMoney){
      this.payMoneyIndex = 5;
      this.inputMoneyVal = global.otherBaseData.secMoney;
    } // end of if
    // this.initGetMainListData();
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
  .money-item{
    padding-top: 8px;
    padding-bottom: 8px;
    border: 1px solid #E62131;
    border-radius: 8px;
    color: #E62131;
  }
  .money-item-select{
    padding-top: 8px;
    padding-bottom: 8px;
    border: 1px solid rgba(230,33,49,1);
    border-radius: 8px;
    background: #E62131;
    color: #ffffff;
  }
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
