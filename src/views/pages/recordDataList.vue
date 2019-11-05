<template>
	<div class="mainDiv">
    <van-nav-bar :left-text="pageTitle" left-arrow @click-left="onClickLeft"/>
    <div class="contentDiv">
      <van-pull-refresh v-model="isRefreshing" @refresh="onRefresh">
        <van-list v-model="isLoadMoreing" :immediate-check="false" :finished="loadFinish" :finished-text="loadFinishStr" :error.sync="loadError" error-text="请求失败，点击重新加载" @load="onLoadMore">
          <div v-for="(item, index) in mainDataList" :key="index">
            <div class="df df-jcb pt-8 pb-8 pl-10 pr-10">
              <div class="dl tl">
                <div class="f-15 colorText3" v-if="isRecharge">{{item.typeName}}</div>
                <div class="f-15 colorText3" v-else>{{item.payCode | filterRefundPaymentType}}</div>
                <div class="f-15 colorTextG mt-10">{{item.createdDate | filterFormatDate}}</div>
              </div>
              <div class="dl tr">
                <div class="f-15 colorText3" v-if="isRecharge">{{item.changeType | filterReChargeType}}{{item.actualMoney}}</div>
                <div class="f-15 colorText3" v-else>{{item.cashMoney}}</div>
                <div class="f-15 colorText3 mt-10" v-if="isRecharge">{{item.status | filterReChargeOrderStatus}}</div>
                <div class="f-15 colorText3 mt-10" v-else>{{item.status | filterRefundResultType}}</div>
              </div>
            </div>
            <div class="flex-line-h"/>
          </div>
        </van-list>
      </van-pull-refresh>
    </div>
	</div>
</template>

<script>
import api from '@/api'

let curPageNum = 1;

export default {
  name: 'tempStopQr',
  data() {
    return {
      pageTitle: '记录',
      mainDataList: [],
      isRefreshing: false,
      isLoadMoreing: false,
      loadError: false,
      loadFinish: false,
      loadFinishStr: '没有更多了!',
      isRecharge: false
    };
  },
  methods: {
    onClickLeft() {
      history.go(-1);
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
    initGetMainListData(isNotResetPage) {
      if (!isNotResetPage) curPageNum = 1;
      api.user.getChargeOrRefundRecordList(this.isRecharge, curPageNum).then(data => {
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
  mounted() {
    this.isRecharge = (this.$route.query && 1 == this.$route.query.recordFlag);
    this.pageTitle = this.isRecharge ? '充值记录' : '退款记录';
    // this.onRefresh(true);
  }
};
</script>

<style lang="scss" scoped>
.mainDiv{
  background-color: #ffffff;
}
.contentDiv{
  height: calc(100vh - 50px);
  overflow-y: scroll;
  .flex-line-h{
    height: 1px;
    background-color: #F2F1F1;
  }
}
</style>
