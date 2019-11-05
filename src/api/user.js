import { apiRequest, uploadRequest } from '@/utils/apiRequest'
export default {
  getWxLoginUrl() {
    return apiRequest({ url: '/xxxx/authorize', method: 'get', loadingMsg: '获取微信登陆参数中...' });
  },
  getWxLoginInfo(code) {
    return apiRequest({ url: '/xxxx/oauth2?code='+code, method: 'get', loadingMsg: '获取微信登陆信息中...' });
  },
  sendLoginCode(phoneNum) {
    return apiRequest({ url: '/xxxx/sendMsg/' + phoneNum + '/1', method: 'get', loadingMsg: '发送验证码中...' });
  },
  userLoginPhone(data) {
    return apiRequest({ url: '/xxxx/login', method: 'post', data, loadingMsg: 'app登陆中...' });
  },
  userBindPhone(data) {
    return apiRequest({ url: '/xxxx/binding', method: 'post', data, loadingMsg: '绑定中...' });
  },
  getSysInfo(isLoading) {
    return apiRequest({ url: '/xxxx/getSysInfo', method: 'post', isHideLoading: !isLoading, loadingMsg: '获取必备信息中...' });
  },
  getUserInfo(data) {
    return apiRequest({ url: '/xxxx/getCustomerById', method: 'post', data, isHideLoading: true });
  },
  getUserMoney() {
    return apiRequest({ url: '/xxxx/getCustomerMoneyById', method: 'post', loadingMsg: '获取用户余额中...', isHideLoading: true });
  },
  uploadUserHead(data) {
    return uploadRequest({ url: '/xxxx/uploadImg', method: 'post', data, loadingMsg: '上传头像中...' });
  },
  updateUserInfo(data) {
    return apiRequest({ url: '/xxxx/updateUser', method: 'post', data, loadingMsg: '更新用户信息中...' });
  },
  getPayMethodList(data) {
    return apiRequest({ url: '/xxxx/getPayMethodList', method: 'post', data, loadingMsg: '获取支付列表中...' });
  },
  getCreatePrePay(data) {
    return apiRequest({ url: '/xxxx/launchPay', method: 'post', data, loadingMsg: '生成预付单中...' });
  },
  confirmPayOrder(data) {
    return apiRequest({ url: '/xxxx/returnNotice', method: 'post', data, loadingMsg: '确认支付结果中...' });
  },
  commitRefundMoney(data) {
    return apiRequest({ url: '/xxxx/applyCash', method: 'post', data, loadingMsg: '发起退款申请中...' });
  },
  getChargeOrRefundRecordList(isGetCharge, curPageNum) {
    return apiRequest({ url: isGetCharge ? '/xxxx/getChargeRecordPage' : '/xxxx/getCashtListPageByuserId', method: 'post', curPageNum, isHideLoading: true });
  }
}