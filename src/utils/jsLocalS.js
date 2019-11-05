// localStorage统一写在这里方便维护,避免很乱
const loginUserInfoKey = 'loginUserInfoKey' // 登录用户信息key
const mainBaseDataKey = 'mainBaseDataKey' // 基础信息key

export const loginUserInfo = {
  getLoginUserInfo: function(isObj) {
    if (isObj) {
      return localStorage.getItem(loginUserInfoKey) ? JSON.parse(localStorage.getItem(loginUserInfoKey)) : null
    } else {
      return localStorage.getItem(loginUserInfoKey)
    }
  },
  setLoginUserInfo: function(userInfoStr) {
    localStorage.setItem(loginUserInfoKey, userInfoStr)
  },
  removeLoginUserInfo: function() {
    localStorage.removeItem(loginUserInfoKey)
  }
}

export const mainBaseData = {
  getMainBaseData: function(isObj) {
    if (isObj) {
      return localStorage.getItem(mainBaseDataKey) ? JSON.parse(localStorage.getItem(mainBaseDataKey)) : null
    } else {
      return localStorage.getItem(mainBaseDataKey)
    }
  },
  setMainBaseData: function(mainBaseDataStr) {
    localStorage.setItem(mainBaseDataKey, mainBaseDataStr)
  },
  removeMainBaseData: function() {
    localStorage.removeItem(mainBaseDataKey)
  }
}
