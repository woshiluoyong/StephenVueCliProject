export default {
  httpBaseApiUrl: function() { // 获取服务器地址
    return 'https://xxxx.xxxxxx.com';
  },
  httpApiPrefix: '/api',
  successErrorCode: 0, // 返回值正确
  sessionExpirCode: 405, // 未登录-登陆信息丢失
  moneyInadequateCode: 888, // 余额不足
  curPageSize: 10, // 正常分页数量
  maxPageSize: 9999, // 不分页时传的最大分页数量
  getImgAddress: function() {
    return this.httpBaseApiUrl() + this.httpApiPrefix + '/getImg/';
  }
}
