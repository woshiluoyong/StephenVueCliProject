<template>
	<div class="mainDiv">
    <van-nav-bar left-text="订单详情" left-arrow @click-left="onClickLeft"/>
    <van-pull-refresh v-model="isRefreshing" :disabled="true" @refresh="onRefresh">
      <div class="contentDiv" ref="contentArea">
        <div class="top-title mt-15 pl-30 pr-30">
          <div class="f-40 colorTheme"><b>{{ this.mainDataInfo.status | filterOrderStatus }}</b></div>
          <div class="f-20 colorTheme" v-if="0 == this.mainDataInfo.status"><b>车位号：{{ this.mainDataInfo.placeNo ? (this.mainDataInfo.placeNo + '号') : '-' }}</b></div>
        </div>
        <div class="top-title mt-10 pl-30 pr-30">
          <div class="f-12 colorTextG">{{ this.mainDataInfo.status | filterOrderStatusDesc }}</div>
          <div class="f-14 colorText3" v-show="0 == this.mainDataInfo.status">请在<van-count-down ref="countDown" :time="countDownMill" :auto-start="false" format="mm分ss秒" class="colorTheme dl"/>内结算订单</div>
        </div>
        <div class="tl pt-20 pl-20 pr-20">
          <div class="colorText3 f-20">使用详情</div>
        </div>
        <div class="content-div tl mt-15 mb-10 pt-15 pl-15 pr-15 pb-15">
          <div class="item-first">
            <div>
              <div class="colorTextG f-12">停车时长</div>
              <div class="colorText3 f-16 mt-10">{{this.mainDataInfo.durationMin | filterMinDate}}</div>
            </div>
            <div>
              <div class="colorTextG f-12">支付方式</div>
              <div class="colorText3 f-16 mt-10">余额：{{ this.mainDataInfo.remainMoney | yuan}}元<span class="colorTheme ml-20" @click="goToRecharge()">充值</span></div>
            </div>
          </div>
          <div class="mt-20">
            <div class="colorTextG f-12">停车地点</div>
            <div class="colorText3 f-16 mt-10">{{this.mainDataInfo.garageAddress}}</div>
          </div>
          <div class="mt-20">
            <div class="colorTextG f-12">小区名称</div>
            <div class="colorText3 f-16 mt-10">{{this.mainDataInfo.houseName}}</div>
          </div>
          <div class="mt-20">
            <div class="colorTextG f-12">车库名称</div>
            <div class="colorText3 f-16 mt-10">{{this.mainDataInfo.garageName}}</div>
          </div>
          <div class="mt-20">
            <div class="colorTextG f-12">车位号</div>
            <div class="colorText3 f-16 mt-10">{{this.mainDataInfo.placeNo || '-'}}</div>
          </div>
          <div class="mt-20">
            <div class="colorTextG f-12">停车时间</div>
            <div class="colorText3 f-16 mt-10">{{this.mainDataInfo.startTimeShow}}</div>
          </div>
          <div class="mt-20">
            <div class="colorTextG f-12">离开时间</div>
            <div class="colorText3 f-16 mt-10">{{this.mainDataInfo.endTimeShow}}</div>
          </div>
          <div class="mt-20">
            <div class="colorTextG f-12">付款金额
              <div class="dl" @click="onShowRuleDialog()" v-if="0 == this.mainDataInfo.status">
                <img src="../../assets/images/icon-small-question.png" width="12" height="12" class="ml-5"/>
                <span class="colorTextH f-11 ml-5">收费标准</span>
              </div>
            </div>
            <div class="colorText3 f-16 mt-10">{{this.mainDataInfo.orderMoney | yuan}}元</div>
          </div>
          <div class="mt-20">
            <div class="colorTextG f-12">临停卡号</div>
            <div class="colorText3 f-16 mt-10">{{this.mainDataInfo.icNo}}</div>
          </div>
          <div class="mt-20">
            <div class="colorTextG f-12">订单编号</div>
            <div class="colorText3 f-16 mt-10">{{this.mainDataInfo.orderNo}}</div>
          </div>
        </div>
      </div>
    </van-pull-refresh>
    <div v-if="0 == this.mainDataInfo.status">
      <div class="flex-line-h"/>
      <van-button type="danger" size="normal" class="bgTheme colorText f-16 mt-10" style="width: 90%; margin-left: 5%;" @click="onSettleOpen()">结算开门</van-button>
    </div>
	</div>
</template>

<script>
import PubSub from 'pubsub-js';
import api from '@/api';
import global from '@/utils/globalVar';
import { getFormatDate, getFormatDateNotDefault } from '@/utils/formatTime';

export default {
  name: 'tempStopQr',
  data() {
    return {
      countDownMill: 10 * 1000,
      isRefreshing: false,
      mainDataInfo: {},
      clientHeight: ''
    };
  },
  methods: {
    onClickLeft() {
      history.go(-1);
    },
    onRefresh() {
      this.initGetMainInfoData();
    },
    onShowRuleDialog() {
      api.work.getTempStandard({ garageId: this.mainDataInfo.gId }).then(data => {
        if (data) {
          let msg = (data.freeSec <= 0 ? '1.此车库无免费分钟数' : ('1.前' + data.freeSecView + '免费')) + '<br/>';
          msg += ('2.前' + data.numSecView + ',收费金额为' + data.secMoney + '元') + '<br/>';
          msg += ('3.超过后每小时收费标准为' + data.money + '元') + '<br/>';
          msg += ('4.最高收费金额' + (data.maxMoney ? ('为' + data.maxMoney + '元') : '无上限'));
          if (data.memo) msg += ('<br/>备注:' + data.memo);
          this.$dialog.alert({ title: '收费标准', messageAlign: 'left', message: msg});
        } else {
          this.$toast('暂无收费标准!');
        }
      });
    },
    goToRecharge() {
      this.$router.push({ path: '/mineRecharge' });
    },
    onSettleOpen() {
      this.$dialog.confirm({ title: '结算开门', className: 'tc', message: '请问您是否确认结算开门' }).then(() => {
        api.work.finishTempStop({ orderId: this.$route.query.orderId, endTime: getFormatDate(), durationMin: this.mainDataInfo.durationMin,
          money: this.mainDataInfo.orderMoney, flag: 0 }).then(data => {
            this.$toast('结算开门成功,请在倒计时有效时间内出场!');
            console.log('=================>this.$route.query.enterFlag:', this.$route.query.enterFlag);
            if ('tempStop' == this.$route.query.enterFlag) {
              history.go(-1);
            } else {
              PubSub.publish('refreshOrderList');
              this.$router.replace({ path: '/tempStopQr' });
            }
        });
      }).catch(() => {});
    },
    initGetMainInfoData() {
      this.isRefreshing = true;
      api.work.getOrderDetails({ orderId: this.$route.query.orderId }).then(data => {
        this.isRefreshing = false;
        if (global.userInfoObj) data.remainMoney = global.userInfoObj.remainMoney;
        data.startTimeShow = getFormatDateNotDefault(data.startTime);
        data.endTimeShow = getFormatDateNotDefault(data.endTime);
        this.mainDataInfo = data;
        if (0 == data.status) {
          this.$refs.countDown.reset();
          this.$refs.countDown.start();
        } else {
          this.fixedContentArea();
        }
      }).catch(err => {
        this.isRefreshing = false;
      });
    },
    fixedContentArea() {//动态修改样式
      if(this.$refs.contentArea)this.$refs.contentArea.style.height = (this.clientHeight - 45) +'px';
    }
  },
  mounted() {
    this.clientHeight = `${document.documentElement.clientHeight}`// 获取浏览器可视区域高度document.body.clientWidth;
    window.onresize = () => {
      this.clientHeight = `${document.documentElement.clientHeight}`;
    };
    this.countDownMill = (60 * 1000 * global.mainBaseData.tempChargeEndMin);
    // this.initGetMainInfoData();
  }
};
</script>

<style lang="scss" scoped>
.mainDiv{
  background-color: #ffffff;
}
.contentDiv{
  position: relative;
  text-align: center;
  height: calc(100vh - 110px);
  /* height: 100vh;
  padding-bottom: 110px; */
  overflow-y: scroll;
}
.flex-line-h{
  height: 1px;
  background-color: #F2F1F1;
}
.top-title{
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.content-div{
  width: 96%;
  margin-left: 2%;
  box-shadow: 0px 25px 65px 0px rgba(64,151,254,0.2);
  border-radius: 10px;
  background: white;
  .item-first{
    display: flex;
    justify-content: space-between;
  }
  span{
    vertical-align: middle;
  }
  img{
    vertical-align: middle;
  }
}
</style>
