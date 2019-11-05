<template>
  <div class="mainDiv">
    <van-nav-bar title="订单"/>
    <van-tabs v-model="tabActive" @change="onTabChange()">
      <van-tab title="全部">
        <div class="contentDiv mb-15">
          <van-pull-refresh v-model="isRefreshing" @refresh="onRefresh">
            <van-list v-model="isLoadMoreing" :immediate-check="false" :finished="loadFinish" :finished-text="loadFinishStr" :error.sync="loadError" error-text="请求失败，点击重新加载" @load="onLoadMore">
              <div v-for="(item, index) in mainDataList" :key="index" class="contentItem tl mt-15 ml-15 mr-15 pl-10 pr-10 pt-10 pb-10" @click="goToOrderDetails(item)">
                <div class="f-15 colorText3">{{item.status | filterOrderStatus}}</div>
                <div class="flex-line-h mt-10 mb-10"/>
                <div class="f-13 colorText3 mt-10">车库/车位号: {{item.garageNo || '-'}}/{{item.placeNo || '-'}}</div>
                <div class="f-13 colorText3 mt-10">车库名称: {{item.garageName}}</div>
                <div class="f-13 colorText3 mt-10">停车地点: {{item.garageAddress}}</div>
                <div class="f-13 colorText3 mt-10" v-if="0 == item.status">停车时长:计费中</div>
                <div class="f-13 colorText3 mt-10" v-else>停车时长: {{item.durationMin | filterMinDate}}</div>
                <div class="f-13 colorText3 mt-10">停车时间: {{item.startTime | filterDateNotDefault}}</div>
                <div class="flex-line-h mt-10 mb-10"/>
                <div class="df df-jcb f-13 colorTextG mt-10">
                  <div class="dl df-1">
                    <img src="../../assets/images/icon-order-money.png" width="13" height="13" class="vam"/>
                    <span class="ml-5 vam">停车费用：{{0 == item.status ? '计费中' : item.orderMoney + '元'}}</span>
                  </div>
                  <div class="dl df-1">
                    <img src="../../assets/images/icon-order-payment.png" width="13" height="13" class="vam"/>
                    <span class="ml-5 vam">支付方式：{{item.payType | filterPaymentMode}}</span>
                  </div>
                </div>
              </div>
            </van-list>
          </van-pull-refresh>
        </div>
      </van-tab>
      <van-tab title="进行中">
        <div class="contentDiv mb-15">
          <van-pull-refresh v-model="isRefreshing" @refresh="onRefresh">
            <van-list v-model="isLoadMoreing" :immediate-check="false" :finished="loadFinish" :finished-text="loadFinishStr" :error.sync="loadError" error-text="请求失败，点击重新加载" @load="onLoadMore">
              <div v-for="(item, index) in mainDataList" :key="index" class="contentItem tl mt-15 ml-15 mr-15 pl-10 pr-10 pt-10 pb-10" @click="goToOrderDetails(item)">
                <div class="f-15 colorText3">{{item.status | filterOrderStatus}}</div>
                <div class="flex-line-h mt-10 mb-10"/>
                <div class="f-13 colorText3 mt-10">车库/车位号: {{item.garageNo || '-'}}/{{item.placeNo || '-'}}</div>
                <div class="f-13 colorText3 mt-10">车库名称: {{item.garageName}}</div>
                <div class="f-13 colorText3 mt-10">停车地点: {{item.garageAddress}}</div>
                <div class="f-13 colorText3 mt-10" v-if="0 == item.status">停车时长:计费中</div>
                <div class="f-13 colorText3 mt-10" v-else>停车时长: {{item.durationMin | filterMinDate}}</div>
                <div class="f-13 colorText3 mt-10">停车时间: {{item.startTime | filterDateNotDefault}}</div>
                <div class="flex-line-h mt-10 mb-10"/>
                <div class="df df-jcb f-13 colorTextG mt-10">
                  <div class="dl df-1">
                    <img src="../../assets/images/icon-order-money.png" width="13" height="13" class="vam"/>
                    <span class="ml-5 vam">停车费用：{{0 == item.status ? '计费中' : item.orderMoney + '元'}}</span>
                  </div>
                  <div class="dl df-1">
                    <img src="../../assets/images/icon-order-payment.png" width="13" height="13" class="vam"/>
                    <span class="ml-5 vam">支付方式：{{item.payType | filterPaymentMode}}</span>
                  </div>
                </div>
              </div>
            </van-list>
          </van-pull-refresh>
        </div>
      </van-tab>
      <van-tab title="已完成">
        <div class="contentDiv mb-15">
          <van-pull-refresh v-model="isRefreshing" @refresh="onRefresh">
            <van-list v-model="isLoadMoreing" :immediate-check="false" :finished="loadFinish" :finished-text="loadFinishStr" :error.sync="loadError" error-text="请求失败，点击重新加载" @load="onLoadMore">
              <div v-for="(item, index) in mainDataList" :key="index" class="contentItem tl mt-15 ml-15 mr-15 pl-10 pr-10 pt-10 pb-10" @click="goToOrderDetails(item)">
                <div class="f-15 colorText3">{{item.status | filterOrderStatus}}</div>
                <div class="flex-line-h mt-10 mb-10"/>
                <div class="f-13 colorText3 mt-10">车库/车位号: {{item.garageNo || '-'}}/{{item.placeNo || '-'}}</div>
                <div class="f-13 colorText3 mt-10">车库名称: {{item.garageName}}</div>
                <div class="f-13 colorText3 mt-10">停车地点: {{item.garageAddress}}</div>
                <div class="f-13 colorText3 mt-10" v-if="0 == item.status">停车时长:计费中</div>
                <div class="f-13 colorText3 mt-10" v-else>停车时长: {{item.durationMin | filterMinDate}}</div>
                <div class="f-13 colorText3 mt-10">停车时间: {{item.startTime | filterDateNotDefault}}</div>
                <div class="flex-line-h mt-10 mb-10"/>
                <div class="df df-jcb f-13 colorTextG mt-10">
                  <div class="dl df-1">
                    <img src="../../assets/images/icon-order-money.png" width="13" height="13" class="vam"/>
                    <span class="ml-5 vam">停车费用：{{0 == item.status ? '计费中' : item.orderMoney + '元'}}</span>
                  </div>
                  <div class="dl df-1">
                    <img src="../../assets/images/icon-order-payment.png" width="13" height="13" class="vam"/>
                    <span class="ml-5 vam">支付方式：{{item.payType | filterPaymentMode}}</span>
                  </div>
                </div>
              </div>
            </van-list>
          </van-pull-refresh>
        </div>
      </van-tab>
      <van-tab title="异常">
        <div class="contentDiv mb-15">
          <van-pull-refresh v-model="isRefreshing" @refresh="onRefresh">
            <van-list v-model="isLoadMoreing" :immediate-check="false" :finished="loadFinish" :finished-text="loadFinishStr" :error.sync="loadError" error-text="请求失败，点击重新加载" @load="onLoadMore">
              <div v-for="(item, index) in mainDataList" :key="index" class="contentItem tl mt-15 ml-15 mr-15 pl-10 pr-10 pt-10 pb-10" @click="goToOrderDetails(item)">
                <div class="f-15 colorText3">{{item.status | filterOrderStatus}}</div>
                <div class="flex-line-h mt-10 mb-10"/>
                <div class="f-13 colorText3 mt-10">车库/车位号: {{item.garageNo || '-'}}/{{item.placeNo || '-'}}</div>
                <div class="f-13 colorText3 mt-10">车库名称: {{item.garageName}}</div>
                <div class="f-13 colorText3 mt-10">停车地点: {{item.garageAddress}}</div>
                <div class="f-13 colorText3 mt-10" v-if="0 == item.status">停车时长:计费中</div>
                <div class="f-13 colorText3 mt-10" v-else>停车时长: {{item.durationMin | filterMinDate}}</div>
                <div class="f-13 colorText3 mt-10">停车时间: {{item.startTime | filterDateNotDefault}}</div>
                <div class="flex-line-h mt-10 mb-10"/>
                <div class="df df-jcb f-13 colorTextG mt-10">
                  <div class="dl df-1">
                    <img src="../../assets/images/icon-order-money.png" width="13" height="13" class="vam"/>
                    <span class="ml-5 vam">停车费用：{{0 == item.status ? '计费中' : item.orderMoney + '元'}}</span>
                  </div>
                  <div class="dl df-1">
                    <img src="../../assets/images/icon-order-payment.png" width="13" height="13" class="vam"/>
                    <span class="ml-5 vam">支付方式：{{item.payType | filterPaymentMode}}</span>
                  </div>
                </div>
              </div>
            </van-list>
          </van-pull-refresh>
        </div>
      </van-tab>
    </van-tabs>
  </div>
</template>

<script>
import PubSub from 'pubsub-js';
import api from '@/api'
import { getFormatDateNotDefault } from '@/utils/formatTime';

let curPageNum = 1;

export default {
  data() {
    return {
      tabActive: 0,
      mainDataList: [],
      isRefreshing: false,
      isLoadMoreing: false,
      loadError: false,
      loadFinish: false,
      loadFinishStr: '没有更多了!'
    };
  },
  filters: {
    filterDateNotDefault(value) {
      return getFormatDateNotDefault(value);
    }
  },
  methods: {
    onTabChange() {
      this.onRefresh(true);
    },
    goToOrderDetails(item) {
      this.$router.push({ path: '/orderDetails', query: { orderId: item.id, enterFlag: 'orderList' } });
    },
    onRefresh(isHand) {
      if (!isHand) isHand = false;
      this.isRefreshing = isHand;
      this.loadFinish = false;
      this.mainDataList = [];
      this.initGetMainListData();
    },
    onLoadMore() {
      curPageNum++;
      this.initGetMainListData(true);
    },
    initGetMainListData(isNotResetPage) {
      if (!isNotResetPage) curPageNum = 1;
      api.work.getOrderListData(0 == this.tabActive ? {} : { status: this.tabActive - 1 }, curPageNum).then(data => {// null：全部，0:进行中，1：已完成，2：异常
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
    }
  },
  beforeDestroy() {
    PubSub.unsubscribe('refreshOrderList');
  },
  mounted() {
    this.onTabChange();
    PubSub.subscribe('refreshOrderList', (msg, param) => {// msg没有用，但是必须得有(语法就是这么规定的)
      this.onTabChange();
    });
  }
};
</script>

<style lang="scss" scoped>
.mainDiv{
  background-color: #ffffff;
}
.contentDiv{
  background: #F2F1F1;
  height: calc(100vh - 137px);
  padding-bottom: 10px;
  overflow-y: scroll;
  .contentItem{
    background: #ffffff;
    border-radius: 8px;
    .flex-line-h{
      height: 1px;
      background-color: #F2F1F1;
    }
  }
}
</style>
