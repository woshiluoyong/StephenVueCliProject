import { apiRequest } from '@/utils/apiRequest'
export default {
  getTempStop(data) {
    return apiRequest({ url: '/xxxx/getTempStop', method: 'post', data, isHideLoading: true });
  },
  onceTempStop(data) {
    return apiRequest({ url: '/xxxx/conformTempStop', method: 'post', data, loadingMsg: '再次临停请求中...' });
  },
  finishTempStop(data) {
    return apiRequest({ url: '/xxxx/chargeTempStop', method: 'post', data, loadingMsg: '临停结算开门中...' });
  },
  getTempStandard(data) {
    return apiRequest({ url: '/xxxx/getTempFeeStandard', method: 'post', data, loadingMsg: '获取临停标准中...' });
  },
  getGarageList(data, curPageNum) {
    return apiRequest({ url: '/xxxx/getGarageListPageByGarageNo', method: 'post', data, curPageNum, isHideLoading: true });
  },
  checkGarageTempStop(data) {
    return apiRequest({ url: '/xxxx/judgeGoTempChargeByGarageId', method: 'post', data, loadingMsg: '校验临停中...' });
  },
  getAreaList(data) {
    return apiRequest({ url: '/xxxx/getAreaList', method: 'post', data, loadingMsg: '获取区域数据中...' });
  },
  getHouseList(data) {
    return apiRequest({ url: '/xxxx/getHouseListByPage', method: 'post', data, loadingMsg: '获取小区数据中...' });
  },
  getGarageListByHouseId(data) {
    return apiRequest({ url: '/xxxx/getGarageListPageByHouseId', method: 'post', data, loadingMsg: '获取小区车库数据中...' });
  },
  getGarageTempStopInfo(data) {
    return apiRequest({ url: '/xxxx/getGarageInfoAndTempChargeInfoByGarageId', method: 'post', data, loadingMsg: '获取车库临停数据中...' });
  },
  startTempStop(data) {
    return apiRequest({ url: '/xxxx/conformTempStop', method: 'post', data, loadingMsg: '开始临停请求中...' });
  },
  getOrderListData(data, curPageNum) {
    return apiRequest({ url: '/xxxx/getOrderListByPage', method: 'post', data, curPageNum, isHideLoading: true });
  },
  getOrderDetails(data) {
    return apiRequest({ url: '/xxxx/getOrderById', method: 'post', data, isHideLoading: true });
  },
}