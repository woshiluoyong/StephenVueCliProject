<template>
	<div class="mainDiv">
    <van-nav-bar left-text="确认" left-arrow @click-left="onClickLeft"/>
		<div class="contentDiv">
      <!-- <img src="../../assets/images/img-main-qr-bg.png" width="100%" height="380"/> -->
      <div class="tl pt-30 pl-20 pr-20">
        <div class="colorText3 f-16">车库编号：{{mainDataInfo.no}}</div>
        <div class="colorTextG f-13 mt-10">车库名称：{{mainDataInfo.name}}</div>
        <div class="colorTextG f-13 mt-3">车库门数：{{mainDataInfo.doorNum}}</div>
        <div class="colorTextG f-13 mt-3">车库地址：{{mainDataInfo.address}}</div>
        <div class="colorTextG f-13 mt-3">小区名称：{{mainDataInfo.houseName}}</div>
        <div class="colorTextG f-13 mt-3">小区位置：{{mainDataInfo.houseAddress}}</div>
        <div class="garage-bottom f-13 colorText3 mt-5">
          <div class="dl">
            <span class="">车位总数:&nbsp;{{1 == mainDataInfo.isGaragePlace ? '无限制' : mainDataInfo.totalNum}}</span>
            <span class="ml-5">可用车位:&nbsp;{{1 == mainDataInfo.isGaragePlace ? '无限制' : mainDataInfo.remainNum}}</span>
          </div>
          <div class="dl">
            <img :src="1 == mainDataInfo.isTempStop ? imgSupportFalse : imgSupportTrue" width="13" height="13" class="ml-10"/>
            <span class="ml-5">支持临停</span>
            <img :src="1 == mainDataInfo.isMonthStop ? imgSupportFalse : imgSupportTrue" width="13" height="13" class="ml-5"/>
            <span class="ml-5">支持月卡</span>
          </div>
        </div>
      </div>
      <div class="tl pt-30 pl-20 pr-20">
        <div class="colorText3 f-15">收费标准</div>
        <div v-if="standardData">
          <div class="colorText3 f-13 mt-10">{{standardData.freeSec <= 0 ? '1.此车库无免费分钟数' : ('1.前' + standardData.freeSecView + '免费')}}</div>
          <div class="colorText3 f-13 mt-3">{{'2.前' + standardData.numSecView + ',收费金额为' + standardData.secMoney + '元'}}</div>
          <div class="colorText3 f-13 mt-3">{{'3.超过后每小时收费标准为' + standardData.money + '元'}}</div>
          <div class="colorText3 f-13 mt-3">{{'4.最高收费金额' + (standardData.maxMoney ? ('为' + standardData.maxMoney + '元') : '无上限')}}</div>
          <div class="colorText3 f-13 mt-3" v-if="standardData.memo">{{'备注:' + standardData.memo}}</div>
        </div>
        <div class="colorTextG f-13 mt-10" v-else>暂无</div>
      </div>
      <van-radio-group v-model="isCharge" class="df df-jcs mt-30 ml-20 mr-40">
        <div class="dl"><van-radio name="1" checked-color="#E62131">需要充电</van-radio></div>
        <div class="dl ml-20"><van-radio name="0" checked-color="#E62131">无需充电</van-radio></div>
      </van-radio-group>
      <!-- <div class="tl pt-30 pl-20 pr-20">
        <div class="colorText3 f-15">我的余额：{{myRemainMoney | yuan}}元<span class="colorTheme ml-20" @click="goToRecharge()">充值</span></div>
        <div class="dl garage-bottom mt-15" @click="isPayAlipay = false">
          <div class="dl">
            <img src="../../assets/images/icon-info-wechat.png" width="13" height="13" class="ml-15"/>
            <span class="ml-5">微信支付</span>
          </div>
          <img :src="isPayAlipay ? imgRadioUnSelect : imgRadioSelected" width="13" height="13" class="mr-15 pr" style="top: 4px;"/>
        </div>
        <div class="flex-line-h mt-10 mb-10"/>
        <div class="dl garage-bottom" @click="isPayAlipay = true">
          <div class="dl">
            <img src="../../assets/images/icon-info-alipay.png" width="13" height="13" class="ml-15"/>
            <span class="ml-5">支付宝支付</span>
          </div>
          <img :src="isPayAlipay ? imgRadioSelected : imgRadioUnSelect" width="13" height="13" class="mr-15 pr" style="top: 4px;"/>
        </div>
      </div> -->
		</div>
    <div class="colorText3 f-15 tr mb-2 mr-20" v-if="standardData">本次临停最低预收费：{{standardData.secMoney | yuan}}元</div>
    <div class="flex-line-h"/>
    <van-button type="danger" size="normal" class="bgTheme colorText f-16 mt-10" style="width: 90%; margin-left: 5%;" @click="commitSureStopInfo()">确认临停</van-button>
	</div>
</template>

<script>
import PubSub from 'pubsub-js';
import imgSupportTrue from '@/assets/images/icon-small-true.png';
import imgSupportFalse from '@/assets/images/icon-small-false.png';
import imgRadioSelected from '@/assets/images/icon-radio-selected.png';
import imgRadioUnSelect from '@/assets/images/icon-radio-unselect.png';
import global from '@/utils/globalVar';
import api from '@/api'

export default {
  name: 'tempStopQr',
  data() {
    return {
      imgSupportTrue,
      imgSupportFalse,
      imgRadioSelected,
      imgRadioUnSelect,
      isPayAlipay: false,
      mainDataInfo: {},
      standardData: null,
      myRemainMoney: 0,
      isCharge: -1
    };
  },
  methods: {
    onClickLeft() {
      history.go(-1);
    },
    goToRecharge() {
      this.$router.push({ path: '/mineRecharge' });
    },
    commitSureStopInfo() {
      if (0 == this.isCharge || 1 == this.isCharge){
        this.$dialog.confirm({ title: '确认临停', className: 'tc', message: '请问您是否确认临时停车操作' }).then(() => {
          api.work.startTempStop({ garageId: this.$route.query.garageId, channelType: 0, isCharge: this.isCharge }).then(() => {
            this.$toast('临停成功,请在倒计时有效时间内停车进场!');
            /* PubSub.publish('refreshQrCodeData');channelType:临停渠道类型（0，微信公众号，1：IOS APP，2：安卓APP）
            history.go(-1); */
            this.$router.replace({ path: '/tempStopQr' });
          });
        }).catch(() => {});
      } else {
        this.$toast('请选择是否充电!');
      }
    },
    initGetMainInfoData() {
      api.work.getGarageTempStopInfo({ garageId: this.$route.query.garageId }).then(data => {
        this.mainDataInfo = data.garageVo || {};
        this.standardData = data.tempChargeVo || null;
        if (this.standardData) {
          const curOtherBaseData = global.otherBaseData;
          curOtherBaseData.secMoney = this.standardData.secMoney || '';
          global.setOtherBaseData(curOtherBaseData);
        } // end of if
      });
    }
  },
  mounted() {
    // this.initGetMainInfoData();
    //if (global.userInfoObj) this.myRemainMoney = global.userInfoObj.remainMoney;
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
  height: calc(100vh - 125px);
}
.flex-line-h{
  height: 1px;
  background-color: #F2F1F1;
}
.garage-bottom{
  display: flex;
  justify-content: space-between;
  span{
    vertical-align: middle;
  }
  img{
    vertical-align: middle;
  }
}
</style>
