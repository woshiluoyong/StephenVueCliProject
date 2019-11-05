<template>
	<div class="mainDiv">
    <van-nav-bar left-text="搜索车库" :right-text="isEnterSearch ? '' : '下一步'" left-arrow @click-left="onClickLeft" @click-right="onClickRight"/>
		<div class="contentDiv">
      <div class="top-search bgGrayColor tc mt-15 ml-20 mb-15 mr-20">
        <div v-if="!isEnterSearch" @click="onChangeEnter(true)">
          <img src="../../assets/images/icon-search-garage.png" width="15" height="15"/>
          <span class="f-15 colorTextG2 ml-10">搜索车库编号或名称</span>
        </div>
        <form v-else action="/"><van-search v-model="searchTextStr" placeholder="请输入搜索车库编号或名称" :show-action="true"
          @search="onExecSearch" @cancel="onChangeEnter(false)"/></form>
      </div>
      <div class="bgGrayColor pt-6 pb-6"/>
      <div class="flex-list" v-if="isEnterSearch">
        <van-pull-refresh v-model="isRefreshing" @refresh="onRefresh">
          <van-list v-model="isLoadMoreing" :immediate-check="false" :finished="loadFinish" :finished-text="loadFinishStr" :error.sync="loadError" error-text="请求失败，点击重新加载" @load="onLoadMore">
            <div v-for="(item, index) in mainDataList" :key="index" class="tl" @click="goToConfirmStop(item)">
              <div class="pt-10 pl-15 pr-15 pb-10">
                <div class="f-18 colorText3 df df-jcb">
                  <span>车库编号：{{item.no}}</span>
                  <div class="dl f-12" @click.stop="onShowRuleDialog(item)">
                    <img src="../../assets/images/icon-small-question.png" width="13" height="13" class="ml-5 vam"/>
                    <span class="ml-3 vam">收费标准</span>
                  </div>
                </div>
                <div class="f-12 colorTextG mt-10">车库名称：{{item.name}}</div>
                <div class="f-12 colorTextG mt-5">车库门数：{{item.doorNum}}</div>
                <div class="f-12 colorTextG mt-5">车库地址：{{item.address}}</div>
                <div class="f-12 colorTextG mt-5">小区名称：{{item.houseName}}</div>
                <div class="f-12 colorTextG mt-5">小区位置：{{item.houseAddress}}</div>
                <div class="garage-bottom f-12 colorText3 mt-5">
                  <span class="">车位总数:&nbsp;{{1 == item.isGaragePlace ? '无限制' : item.totalNum}}</span>
                  <span class="ml-10">可用车位:&nbsp;{{1 == item.isGaragePlace ? '无限制' : item.remainNum}}</span>
                  <img :src="1 == item.isTempStop ? imgSupportFalse : imgSupportTrue" width="13" height="13" class="ml-20"/>
                  <span class="ml-3">支持临停</span>
                  <img :src="1 == item.isMonthStop ? imgSupportFalse : imgSupportTrue" width="13" height="13" class="ml-10"/>
                  <span class="ml-3">支持月卡</span>
                </div>
              </div>
              <div class="flex-line-h"/>
            </div>
          </van-list>
        </van-pull-refresh>
      </div>
      <div v-else>
        <div class="df">
          <div class="flex-item dl tc">
            <span class="f-14 colorText3 mr-10">省</span>
            <img src="../../assets/images/icon-pull-right.png" width="17" height="17"/>
          </div>
          <div class="flex-line-v mt-10 mb-10"/>
          <div class="flex-item dl tc">
            <span class="f-14 colorText3 mr-10">市</span>
            <img src="../../assets/images/icon-pull-right.png" width="17" height="17"/>
          </div>
          <div class="flex-line-v mt-10 mb-10"/>
          <div class="flex-item dl tc">
            <span class="f-14 colorText3 mr-10">区</span>
            <img src="../../assets/images/icon-pull-right.png" width="17" height="17"/>
          </div>
        </div>
        <div class="flex-line-h"/>
        <div class="flex-content df">
          <div class="flex-content-item dl" v-if="provinceList && provinceList.length > 0">
            <div v-for="(item, index) in provinceList" :key="index" class="content-item tc" @click="onSelectProvince(item, index)">
              <span class="f-14 mr-10" :class="{ 'colorTheme': provinceIndex == index, 'colorText3': provinceIndex != index }">{{item.areaName}}</span>
            </div>
          </div>
          <div class="flex-content-item dl" v-else>
            <div class="colorTextG f-15 mt-10">暂无</div>
          </div>
          <div class="flex-line-v"/>
          <div class="flex-content-item dl" v-if="cityList && cityList.length > 0">
            <div v-for="(item, index) in cityList" :key="index" class="content-item tc" @click="onSelectCity(item, index)">
              <span class="f-14 mr-10" :class="{ 'colorTheme': cityIndex == index, 'colorText3': cityIndex != index }">{{item.areaName}}</span>
            </div>
          </div>
          <div class="flex-content-item dl" v-else>
            <div class="colorTextG f-15 mt-10">暂无</div>
          </div>
          <div class="flex-line-v"/>
          <div class="flex-content-item dl" v-if="areaList && areaList.length > 0">
            <div v-for="(item, index) in areaList" :key="index" class="content-item tc" @click="onSelectArea(item, index)">
              <span class="f-14 mr-10" :class="{ 'colorTheme': areaIndex == index, 'colorText3': areaIndex != index }">{{item.areaName}}</span>
            </div>
          </div>
          <div class="flex-content-item dl" v-else>
            <div class="colorTextG f-15 mt-10">暂无</div>
          </div>
        </div>
      </div>
    </div>
	</div>
</template>

<script>
import PubSub from 'pubsub-js';
import api from '@/api'
import imgSupportTrue from '@/assets/images/icon-small-true.png';
import imgSupportFalse from '@/assets/images/icon-small-false.png';

let curPageNum = 1;

export default {
  name: 'tempStopQr',
  data() {
    return {
      imgSupportTrue,
      imgSupportFalse,
      isRefreshing: false,
      isLoadMoreing: false,
      loadError: false,
      loadFinish: false,
      loadFinishStr: '没有更多了!',
      isEnterSearch: false,
      searchTextStr: '',
      provinceList: [],
      cityList: [],
      areaList: [],
      provinceIndex: -1,
      cityIndex: -1,
      areaIndex: -1,
      mainDataList: []
    };
  },
  methods: {
    onClickLeft() {
      history.go(-1);
    },
    onClickRight() {
      if (this.isEnterSearch) return;
      if (this.provinceIndex >= 0 && this.cityIndex >= 0 && this.areaIndex >= 0) {
        this.$router.push({ path: '/selectGarage', query: { provinceId: this.provinceList[this.provinceIndex].id,
          cityId: this.cityList[this.cityIndex].id, districtId: this.areaList[this.areaIndex].id } });
      } else {
        this.$toast('请将省市区数据选择完全!');
      }
    },
    onRefresh(isHand) {
      if (isHand) this.isRefreshing = true;
      this.mainDataList = [];
      this.initGetMainListData();
    },
    onLoadMore() {
      curPageNum++;
      this.initGetMainListData(true);
    },
    onSelectProvince(item, index) {
      this.provinceIndex = index;
      this.initGetMainInfoData(1, item.id, true);
    },
    onSelectCity(item, index) {
      this.cityIndex = index;
      this.initGetMainInfoData(2, item.id, true);
    },
    onSelectArea(item, index) {
      this.areaIndex = index;
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
    onChangeEnter(isEnterSearch) {
      this.isEnterSearch = isEnterSearch;
      if (isEnterSearch) {
        this.loadFinish = true;
        this.loadFinishStr = '请输入关键字搜索!';
      } // end of if
    },
    onExecSearch() {
      if (!this.searchTextStr) {
        this.$toast('请输入搜索车库编号或者名称');
        return;
      } // end of if
      this.onRefresh();
    },
    goToConfirmStop(item) {
      api.work.checkGarageTempStop({ garageId: item.id }).then(() => {
        this.$router.push({ path: '/confirmStop', query: { garageId: item.id } });
      });
    },
    initGetMainListData(isNotResetPage) {
      this.loadError = false;
      if (!isNotResetPage) curPageNum = 1;
      api.work.getGarageList({ garageNo: this.searchTextStr }, curPageNum).then(data => {// 车库编号或者名称
        this.isRefreshing = false;
        this.isLoadMoreing = false;
        if (data && data.list && data.list.length > 0) {
          const dataList = isNotResetPage ? this.mainDataList : [];
          this.mainDataList = dataList.concat(data.list);
          this.loadFinish = (curPageNum == data.pages);
          this.loadFinishStr = '没有更多了!';
        } else {
          this.loadFinish = true;
          this.loadFinishStr = '暂无数据!';
        }
      }).catch(err => {
        this.isRefreshing = false;
        this.isLoadMoreing = false;
        this.loadError = true;
      });
    },
    initGetMainInfoData(areaGetFlag, areaGetId, isGetNext) {
      api.work.getAreaList({ parentId: areaGetId, dgBz: 0 }).then(data => {//parentId: 父级parentId,parentId 0 表示顶级省份; dgBz: 0：只查询当前父节点下的子节点，1：递归查询父节点下所有的子节点
        switch (areaGetFlag) { // 0省1市2区
          case 0:
            this.provinceList = data;
            if (isGetNext) {
              this.provinceIndex = (data && data.length > 0) ? 0 : -1;
              this.initGetMainInfoData(1, (data && data.length > 0) ? data[0].id : '', true);
            } // end of if
            break;
          case 1:
            this.cityList = data;
            if (isGetNext) {
              this.cityIndex = (data && data.length > 0) ? 0 : -1;
              this.initGetMainInfoData(2, (data && data.length > 0) ? data[0].id : '', true);
            } // end of if
            break;
          case 2:
            this.areaList = data;
            if (isGetNext) this.areaIndex = (data && data.length > 0) ? 0 : -1;
            break;
          default: break;
        } // end of switch
      });
    }
  },
  mounted() {
    // this.initGetMainInfoData(0, 0, true);
    /* PubSub.subscribe('refreshQrCodeData', (msg, param) => {// msg没有用，但是必须得有(语法就是这么规定的)
      console.log('===============subscribe========refreshQrCodeData=>1');
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
  .top-search{
    height: 40px;
    line-height: 40px;
    border-radius: 8px;
    img{
      position: relative;
      top: 2px;
    }
  }
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
    height: calc(100vh - 180px);
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
    }
  }
  .flex-list{
    height: calc(100vh - 130px);
    overflow-y: scroll;
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
