<template>
	<div class="mainDiv">
    <van-nav-bar left-text="临时停车" left-arrow @click-left="onClickLeft"/>
    <van-pull-refresh v-model="isRefreshing" @refresh="onRefresh">
      <div class="contentDiv">
        <img src="../../assets/images/img-main-qr-bg.png" width="100%" height="380"/>
        <img src="../../assets/images/img-main-qr-pic-bg.png" width="94%" height="380" class="qr-pic-bg"/>
        <div class="qr-core-div">
          <div class="f-13 colorText2">将二维码对准扫码区</div>
          <div class="qr-code-div" :class="{ 'has-opacity': !isRefreshQrCode }">
            <!-- <img src="../../assets/images/img-qr-demo.png" width="230" height="230" class="qr-code-pic mt-16 mb-8"/> -->
            <canvas id="canvas" class="qr-code-pic mt-16 mb-8"></canvas>
          </div>
          <div class="qr-code-overlay" v-show="!isRefreshQrCode">
            <div class="f-14 colorText4 mt-5">{{(1 == this.mainDataInfo.isExistsOrderNo && 0 == this.mainDataInfo.status) ? '您有未结算的订单,' : '当前无停车权限,'}}</div>
            <div class="f-14 colorText4 mt-5">{{(1 == this.mainDataInfo.isExistsOrderNo && 0 == this.mainDataInfo.status) ? '请在订单结算后扫码出门' : '请选择小区车库进行停车'}}</div>
            <van-button type="danger" size="small" class="bgTheme colorText f-16 w-125 mt-10" @click="onClickQrOverlayBtn()">确定</van-button>
          </div>
          <div v-show="isRefreshQrCode">
            <div class="f-12 colorText2" @click="initGetMainInfoData(true)">
              <span class="vam">{{qrRefreshFlag ? (1 == qrRefreshFlag ? '刷新成功' : '刷新失败') : '刷新'}}</span>
              <img :src="1 == qrRefreshFlag ? imgRefreshOk : imgRefreshFail" width="10" height="8" class="ml-6 vam" v-show="qrRefreshFlag"/>
            </div>
            <div class="f-12 colorText2 mt-5">倒计时有效时间:
              <countdown :auto-start="false" :time="countDownMill" ref="countDown" @countdownend="onCountDownFinish">
                <template slot-scope="props">{{ props.minutes }}分{{ props.seconds }}秒</template>
              </countdown>
            </div>
          </div>
          <div class="f-14 colorText2 mt-15" v-show="!isRefreshQrCode">余额: {{this.mainDataInfo.remainMoney | yuan}}元</div>
        </div>
      </div>
      <div class="tc mt-20">
        <div v-show="isRefreshQrCode">
          <div class="f-22 colorText3">余额<span class="f-16 colorText3">({{this.mainDataInfo.remainMoney | yuan}}元)</span>/<span @click="goToRecharge()">充值</span>
            <span class="colorTheme ml-20" @click="onClickOperationBtn()">{{(1 == this.mainDataInfo.inOrOut) ? '结算出场' : '我要临停'}}</span>
          </div>
        </div>
        <div v-show="(1 == this.mainDataInfo.isExistsOrderNo && (0 == this.mainDataInfo.status || 1 == this.mainDataInfo.status) && this.mainDataInfo.openCloseAuthMin > 0)">
          <div class="f-14 colorTextG mt-10">{{this.mainDataInfo.garageName}}({{this.mainDataInfo.garageNo}})</div>
          <div class="f-22 colorTheme mt-10" v-if="0 === this.mainDataInfo.isGaragePlace">车位号：{{this.mainDataInfo.placeNo}}号</div>
          <div class="f-22 colorTheme mt-10" v-else>车位号：流动车位</div>
        </div>
      </div>
    </van-pull-refresh>
    <van-dialog v-model="modalOnceVisible" title="提示" :show-confirm-button="false">
      <div class="mt-10 tc">请选择想要临时停车的车库</div>
      <div class="mt-15 df">
        <van-button type="default" size="normal" class="df-1" @click="modalOnceVisible = false">取消</van-button>
        <van-button type="default" size="normal" class="df-1 colorTheme" @click="commitSureStopInfo()">当前车库</van-button>
        <van-button type="default" size="normal" class="df-1" @click="goToGarage()">其他车库</van-button>
      </div>
    </van-dialog>
	</div>
</template>

<script>
import QRCode from 'qrcode';
import PubSub from 'pubsub-js';
import api from '@/api';
import global from '@/utils/globalVar';
import imgRefreshOk from '@/assets/images/icon-small-ok.png';
import imgRefreshFail from '@/assets/images/icon-small-fail.png';

export default {
  name: 'tempStopQr',
  components: {
    QRCode
  },
  data() {
    return {
      imgRefreshOk,
      imgRefreshFail,
      countDownMill: 10 * 1000,
      isRefreshing: false,
      mainDataInfo: {},
      isRefreshQrCode: false, // 是否刷新二维码(进场/出场几分钟以内)
      qrRefreshFlag: 0, // 0 手动刷新, 1 刷新成功, 2 刷新失败
      modalOnceVisible: false // 再次临停
    };
  },
  methods: {
    onClickLeft() {
      history.go(-1);
    },
    onRefresh() {
      this.initGetMainInfoData();
    },
    onCountDownFinish() {
      console.log('===============countDownFinish=>');
      this.initGetMainInfoData();
    },
    onClickQrOverlayBtn() {
      if (1 == this.mainDataInfo.isExistsOrderNo && 0 == this.mainDataInfo.status) {
        this.$router.push({ path: '/orderDetails', query: { orderId: this.mainDataInfo.orderId, enterFlag: 'tempStop' } });
      } else {
        this.goToGarage();
      }
    },
    onClickOperationBtn() {
      if (1 == this.mainDataInfo.inOrOut) {
        this.$router.push({ path: '/orderDetails', query: { orderId: this.mainDataInfo.orderId, enterFlag: 'tempStop' } });
      } else {
        this.modalOnceVisible = true;
      }
    },
    goToGarage() {
      this.modalOnceVisible = false;
      this.$router.push({ path: '/searchGarage' });
    },
    goToRecharge() {
      this.$router.push({ path: '/mineRecharge' });
    },
    commitSureStopInfo() {
      this.modalOnceVisible = false;
      if (!this.mainDataInfo) {
        this.$toast('参数错误,无法再次临停');
        return;
      } // end of if
      api.work.onceTempStop({ garageId: this.mainDataInfo.garageId, channelType: 0 }).then(data => {
        this.initGetMainInfoData();
      });
    },
    execRefreshQrCode(qrCodeStr) {
      console.log('=================>qrCodeStr:', qrCodeStr);
      const canvas = document.getElementById('canvas');
      const self = this;
      QRCode.toCanvas(canvas, qrCodeStr, function (error) {
        if (error) {
          console.error('=======QRCode=>', error);
          self.qrRefreshFlag = 2 ;
          setTimeout(() => self.qrRefreshFlag = 0, 2000);
        } else {
          self.qrRefreshFlag = 1 ;
          setTimeout(() => self.qrRefreshFlag = 0, 2000);
        }
      });
    },
    initGetMainInfoData(isRefreshQr) {
      if(!isRefreshQr)this.isRefreshing = true;
      api.work.getTempStop({ type: 1 }).then(data => {
      }).catch(err => {
        if(!isRefreshQr)this.isRefreshing = false;
      });
    }
  },
  mounted() {
    //PubSub.unsubscribe('refreshQrCodeData');//会取消所有界面的这个名字的订阅
    //this.initGetMainInfoData();
  }
};
</script>

<style lang="scss" scoped>
.mainDiv{
  background-color: #ffffff;
}
.contentDiv{
  height: 400px;
  text-align: center;
}
.qr-pic-bg{
  position: absolute;
  top: 15px;
  left: 3%;
}
.qr-core-div{
  display: inline-block;
  position: relative;
  top: -330px;
  .qr-code-div{
    &.has-opacity{
      opacity: 0.1;
    }
    .qr-code-pic{
      width: 230px !important;
      height: 230px !important;
    }
  }
  .qr-code-overlay{
    position: absolute;
    top: 100px;
    width: 100%;
  }
}
</style>
