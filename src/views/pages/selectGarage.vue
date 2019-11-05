<template>
	<div class="mainDiv">
    <van-nav-bar left-text="选择车库" left-arrow @click-left="onClickLeft"/>
		<div class="contentDiv">
      <div class="flex-content df">
        <div class="flex-content-item dl">
          <div class="content-item tc">
            <span class="f-14 colorText3 mr-10">小区</span>
          </div>
          <div class="flex-line-h"/>
          <div class="content-item2" v-if="houseList && houseList.length > 0">
            <div v-for="(item, index) in houseList" :key="index" class="content-item tc" @click="initGetMainListData(index)">
              <span class="f-14 mr-10" :class="{ 'colorTheme': houseIndex == index, 'colorText3': houseIndex != index }">{{item.name}}({{item.simpleName}})</span>
            </div>
          </div>
          <div class="content-item2" v-else>
            <div class="colorTextG f-15 mt-10">暂无</div>
          </div>
        </div>
        <div class="flex-line-v"/>
        <div class="flex-content-item content-item3 dl" v-if="mainDataList && mainDataList.length > 0">
          <div v-for="(item, index) in mainDataList" :key="index" class="tl" @click="onSelectGarage(index)">
            <div class="df pt-10 pl-10 pb-10">
              <div class="dl" style="flex: 0.95">
                <div class="f-18 colorText3">车库编号：{{item.no}}</div>
                <div class="f-12 colorTextG mt-10">车库名称：{{item.name}}</div>
                <div class="f-12 colorTextG mt-5">车库门数：{{item.doorNum}}</div>
                <div class="f-12 colorTextG mt-5">车库地址：{{item.address}}</div>
                <div class="f-12 colorTextG mt-5">小区名称：{{item.houseName}}</div>
                <div class="f-12 colorTextG mt-5">小区位置：{{item.houseAddress}}</div>
                <div class="garage-bottom f-12 colorText3 mt-8">
                  <span class="">车位总数:&nbsp;&nbsp;{{1 == item.isGaragePlace ? '无限制' : item.totalNum}}</span>
                  <span class="ml-10">可用车位:&nbsp;&nbsp;{{1 == item.isGaragePlace ? '无限制' : item.remainNum}}</span>
                </div>
                <div class="garage-bottom df df-jcb f-12 colorText3 mt-8">
                  <div class="dl">
                    <img :src="1 == item.isTempStop ? imgSupportFalse : imgSupportTrue" width="13" height="13"/>
                    <span class="ml-8">支持临停</span>
                  </div>
                  <div class="dl">
                    <img :src="1 == item.isMonthStop ? imgSupportFalse : imgSupportTrue" width="13" height="13" class="ml-5"/>
                    <span class="ml-8">支持月卡</span>
                  </div>
                </div>
                <div class="dl f-12 colorText3 mt-8" @click.stop="onShowRuleDialog(item)">
                  <img src="../../assets/images/icon-small-question.png" width="13" height="13" class=""/>
                  <span class="ml-10">收费标准</span>
                </div>
              </div>
              <img :src="garageIndex == index ? imgRadioSelected : imgRadioUnSelect" width="13" height="13" class="ml-5" style="alignSelf: center;"/>
            </div>
            <div class="flex-line-h"/>
          </div>
        </div>
        <div class="flex-content-item content-item3 dl" v-else>
          <div class="colorTextG f-15 mt-10">暂无</div>
        </div>
      </div>
      <div class="flex-line-h"/>
      <van-button type="danger" size="normal" class="bgTheme colorText f-16 mt-10 mb-10" style="width: 90%" @click="goToConfirmStop()">确&nbsp;&nbsp;定</van-button>
    </div>
	</div>
</template>

<script>
// import PubSub from 'pubsub-js';
import api from '@/api'
import imgSupportTrue from '@/assets/images/icon-small-true.png';
import imgSupportFalse from '@/assets/images/icon-small-false.png';
import imgRadioSelected from '@/assets/images/icon-radio-selected.png';
import imgRadioUnSelect from '@/assets/images/icon-radio-unselect.png';

export default {
  name: 'tempStopQr',
  data() {
    return {
      imgSupportTrue,
      imgSupportFalse,
      imgRadioSelected,
      imgRadioUnSelect,
      houseList: [],
      houseIndex: -1,
      mainDataList: [],
      garageIndex: -1
    };
  },
  methods: {
    onClickLeft() {
      history.go(-1);
    },
    onSelectGarage(index) {
      this.garageIndex = index;
    },
    onShowRuleDialog(item) {
      api.work.getTempStandard({ garageId: item.id }).then(data => {
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
    goToConfirmStop() {
      if (this.garageIndex >= 0) {
        const garageItem = this.mainDataList[this.garageIndex];
        api.work.checkGarageTempStop({ garageId: garageItem.id }).then(() => {
          this.$router.push({ path: '/confirmStop', query: { garageId: garageItem.id } });
        });
      } else {
        this.$toast('请选择一个车库');
      }
    },
    initGetMainListData(houseIndex) {
      this.houseIndex = houseIndex;
      this.mainDataList = [];
      this.garageIndex = -1;
      api.work.getGarageListByHouseId({ houseId: this.houseList[houseIndex].id }).then(data => {
        if (data && data.list && data.list.length > 0) this.mainDataList = data.list;
      });
    },
    initGetMainInfoData() {
      api.work.getHouseList({ provinceId: this.$route.query.provinceId, cityId: this.$route.query.cityId, districtId: this.$route.query.districtId }).then(data => {
        this.houseList = data.list;
        this.mainDataList = [];
        this.garageIndex = -1;
        if (this.houseList && this.houseList.length > 0) this.initGetMainListData(0);
      });
    }
  },
  mounted() {
    // this.initGetMainInfoData();
    /* PubSub.subscribe('refreshQrCodeData', (msg, param) => {// msg没有用，但是必须得有(语法就是这么规定的)
      history.go(-1);
    }); */
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
  .flex-item{
    flex: 1;
    height: 50px;
    line-height: 50px;
    span{
      vertical-align: middle;
    }
    img{
      vertical-align: middle;
    }
  }
  .flex-line-v{
    width: 1px;
    background-color: #F2F1F1;
  }
  .flex-line-h{
    height: 1px;
    background-color: #F2F1F1;
  }
  .flex-content{
    height: calc(100vh - 105px);
    .flex-content-item{
      flex: 1;
      overflow-y: scroll;
      .content-item{
        height: 50px;
        line-height: 50px;
      }
      span{
        vertical-align: middle;
      }
      img{
        vertical-align: middle;
      }
      /* .content-item2{
        overflow-y: scroll;
      } */
      &.content-item3{
        flex: 2;
        //overflow-y: scroll;
      }
    }
  }

  .garage-bottom{
    span{
      vertical-align: middle;
    }
    img{
      vertical-align: middle;
    }
  }
}
</style>
