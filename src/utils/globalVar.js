// 全局变量
let routerObj = null; // 路由对象
let userInfoObj = null; // 用户信息
let mainBaseData = {}; // 基础信息
let otherBaseData = {}; // 辅助信息

export default {
  routerObj,
  userInfoObj,
  mainBaseData,
  otherBaseData,
  setRouterObj: function(routerObj) {
    this.routerObj = routerObj
  },
  setUserInfoObj: function(userInfoObj) {
    this.userInfoObj = userInfoObj
  },
  setMainBaseData: function(mainBaseData) {
    this.mainBaseData = mainBaseData
  },
  setOtherBaseData: function(otherBaseData) {
    this.otherBaseData = otherBaseData
  }
}
