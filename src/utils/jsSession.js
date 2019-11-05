// sessionStorage统一写在这里方便维护,避免很乱
/* const isLoginSuccessKey = 'isLoginSuccessKey' // 是否登录成功key
const loginUserInfoKey = 'loginUserInfoKey' // 登录用户信息key

export const userLoginStatus = {
  IsLoginSuccess: function() {
    return sessionStorage.getItem(isLoginSuccessKey)
  },
  setLoginSuccessState: function(loginToken) {
    sessionStorage.setItem(isLoginSuccessKey, loginToken)
  },
  removeLoginSuccessState: function() {
    sessionStorage.removeItem(isLoginSuccessKey)
  }
}

export const loginUserInfo = {
  getLoginUserInfo: function(isObj) {
    if (isObj) {
      return sessionStorage.getItem(loginUserInfoKey) ? JSON.parse(sessionStorage.getItem(loginUserInfoKey)) : {}
    } else {
      return sessionStorage.getItem(loginUserInfoKey)
    }
  },
  setLoginUserInfo: function(userInfoStr) {
    sessionStorage.setItem(loginUserInfoKey, userInfoStr)
  },
  removeLoginUserInfo: function() {
    sessionStorage.removeItem(loginUserInfoKey)
  }
} */
