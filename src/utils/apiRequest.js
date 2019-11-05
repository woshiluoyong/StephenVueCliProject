import Qs from 'qs';
import axios from 'axios';
import { Toast, Dialog } from 'vant';
import sysConfig from '@/utils/config';
import global from '@/utils/globalVar';
import { loginUserInfo } from '@/utils/jsLocalS'

export const apiRequest = axios.create({//开发环境已配置vue.config.js跨域
  baseURL: (process.env.NODE_ENV === 'production' ? sysConfig.httpBaseApiUrl() : '') + sysConfig.httpApiPrefix, // process.env.BASE_API
  crossDomain: true, //跨域的配置项
  timeout: 15 * 1000, // 请求超时时间
  transformRequest: [data => {
    /* var formData = new FormData();
    if (data) {
      for (const [key, value] of Object.entries(data)) {
        console.log('=========apiRequest======formData===>', key, value)
        formData.append(key, value.raw);
      } // end of for
    } // end of if
    return formData; */
    return Qs.stringify(data);
  }],
})

// request拦截器
apiRequest.interceptors.request.use(config => {
  if (!config.isHideLoading) {
    config.isLoadingKey = config.url;
    Toast.loading({ duration: 0, forbidClick: true, loadingType: 'spinner', message: config.loadingMsg });
  } // end of if
  if (config.method == 'get') {
    if (config.url) config.url += ((config.url.includes('?') ? '&' : '?') + 'token=' + (global.userInfoObj ? global.userInfoObj.token : '') + '&loginBz=app');
  } else { // post
    if (!config.data) config.data = {};
    if (!config.curPageNum) config.curPageNum = -1;
    config.data.offset = ((config.curPageNum <= 0) ? 0 : config.curPageNum - 1) * sysConfig.curPageSize;
    config.data.limit = (config.curPageNum < 0) ? sysConfig.maxPageSize : sysConfig.curPageSize;
    if (global.userInfoObj) config.data.token = global.userInfoObj.token;
    config.data.loginBz = 'app';
  }
  requestNormalLog(config);
  return config;
}, error => {
  if (error && error.config) Toast.clear();
  requestExceptionLog(error);
  Promise.reject(error);
})
// response拦截器
apiRequest.interceptors.response.use(response => {
  if (response && response.config) Toast.clear();
  const responseBody = requestSuccessOperation(response);
  return responseBody;
}, error => {
  if (error && error.config) Toast.clear();
  responseExceptionLog(error);
  return Promise.reject(error);
})

export const uploadRequest = axios.create({
  baseURL: process.env.NODE_ENV === 'production' ? sysConfig.httpBaseApiUrl() + sysConfig.httpApiPrefix : '/api', // process.env.BASE_API
  timeout: 20 * 1000, // 请求超时时间
  transformRequest: [data => {
    //return Qs.stringify(data)
    var formData = new FormData();
    for (const [key, value] of Object.entries(data)) {
      //console.log('=========uploadRequest======formData===>', key, value, value.raw)
      formData.append(key, value);
    } // end of for
    return formData;
  }],
  headers: { 'Content-Type': 'multipart/form-data' }//undefined } //
})

// request拦截器
uploadRequest.interceptors.request.use(config => {
  if (!config.isHideLoading) {
    config.isLoadingKey = config.url;
    Toast.loading({ duration: 0, forbidClick: true, loadingType: 'spinner', message: config.loadingMsg });
  } // end of if
  if (config.data) {
    config.data.token = (global.userInfoObj ? global.userInfoObj.token : '');
    config.data.loginBz = 'app';
  } // end of if
  requestNormalLog(config);
  return config;
}, error => {
  if (error && error.config) Toast.clear();
  requestExceptionLog(error);
  Promise.reject(error);
})

// response拦截器
uploadRequest.interceptors.response.use(response => {
  if (response && response.config) Toast.clear();
  const responseBody = requestSuccessOperation(response);
  return responseBody;
}, error => {
  if (error && error.config) Toast.clear();
  responseExceptionLog(error);
  return Promise.reject(error);
})

/* ==========公用方法========== */
function requestNormalLog(config) {
  console.log('========>请求Url:' + config.url + ',请求参数:' + (config.data ? JSON.stringify(config.data).replace(/%2F/g, '/').replace(/%3A/g, ':') : '暂无'))
}

function requestExceptionLog(error) {
  console.error('========>错误的传参:' + ((error && error.stack) ? error.stack : JSON.stringify(error)))
  Toast.fail('错误的传参!' + error.message);
}

function requestSuccessOperation(res) {
  console.log('(' + res.config.url + ')========>返回Status:' + res.status + ',返回Data:' + JSON.stringify(res.data));
  const resCode = (res && res.data) ? res.data.errorCode : null;
  // return res.data.body
  switch (resCode) {
    case sysConfig.successErrorCode:
      return res.data.body;
    case sysConfig.sessionExpirCode:
      logOutUserJumpToHome(res.data.errMsg ? res.data.errMsg : '操作异常,需要重新登录!');
      return Promise.reject(res);
    case sysConfig.moneyInadequateCode:
      Dialog.confirm({ title: '余额不足', className: 'tc', message: '抱歉,当前余额不足,请立即充值!', confirmButtonText: '去充值' }).then(() => {
        if (global.routerObj) global.routerObj.push({ path: '/mineRecharge', query: { enterFlag: 'balanceNotEnough' }});
      }).catch(() => {});
      return Promise.reject(res);
    default:
      Toast.fail({ message: res.data.errMsg ? res.data.errMsg : '操作失败,请重试!' });
      return Promise.reject(res);
  } // end of switch
}

function responseExceptionLog(error) {
  console.error('========>请求报错:' + ((error && error.response && error.response.data && error.response.data.errMsg) ? error.response.data.errMsg : ((error && error.stack) ? error.stack : JSON.stringify(error))));
  error = error.response;
  const resCode = (error && error.data) ? error.data.errorCode : null;
  switch (resCode) {
    case sysConfig.sessionExpirCode:
      logOutUserJumpToHome('操作异常,需要重新登录!');
      break;
    case sysConfig.moneyInadequateCode:
      Dialog.confirm({ title: '余额不足', className: 'tc', message: '抱歉,当前余额不足,请立即充值!', confirmButtonText: '去充值' }).then(() => {
        if (global.routerObj) global.routerObj.push({ path: '/mineRecharge', query: { enterFlag: 'balanceNotEnough' }});
      }).catch(() => {});
      break;
    default:
      Toast.fail((error && error.data && error.data.errMsg) ? (error.data.errMsg.includes('timeout') ? '请求超时,请重试!' : error.data.errMsg) : '网络出现问题!');
      break;
  } // end of switch
}

function logOutUserJumpToHome(message){
  global.setUserInfoObj(null);
  loginUserInfo.removeLoginUserInfo();
  Toast.fail({ message });
  if (global.routerObj) global.routerObj.replace({ path: '/' });
}