import Vue from 'vue';
import Router from 'vue-router';
import { Toast } from 'vant';
import PubSub from 'pubsub-js';
import api from '@/api';
import global from '@/utils/globalVar';
import { loginUserInfo, mainBaseData } from '@/utils/jsLocalS';

import tabbar from './tabbar';
import pages from './pages';

Vue.use(Router);

const RouterModel = new Router({
  mode: 'history',
  routes: [...tabbar, ...pages]
});

RouterModel.beforeEach((to, from, next) => {
  console.log('==========RouterModel===beforeEach====>', to, from);
  if (to.path == '/' && from.path == '/' && to.query && to.query.code) {// 微信登陆重定向回调,获取回调的code
    const loginUserInfoObj = loginUserInfo.getLoginUserInfo(true);//用户信息
    if (loginUserInfoObj && loginUserInfoObj.token) {
      console.log('=================>已经登录了,忽略!');
    } else {
      api.user.getWxLoginInfo(to.query.code).then(data => {
        if (data) {
          if (data.isBinding) {
            global.setUserInfoObj(data);
            loginUserInfo.setLoginUserInfo(JSON.stringify(data));
            PubSub.publish('refreshUserInfo');
            Toast('登陆成功,现在可以正常使用了!');
          } else {
            Toast('为更好的为您服务,请绑定必备手机号!');
            next({ name: 'bindPhone', query: { weiXinUserId: data.weiXinUserId } });
            return;
          }
        } else {
          Toast('获取微信登陆信息失败,请重试!');
        }
      });
    }
  } // end of if
  if (!global.mainBaseData || Object.keys(global.mainBaseData).length <= 0) {//基础信息
    //console.log('=================>基础信息现在为空了');
    const mainBaseDataObj = mainBaseData.getMainBaseData(true);
    if (mainBaseDataObj) {
      mainBaseDataObj.diffTime = 0;// (global.mainBaseData.serverTime - (new Date()).getTime());// 这里不能计算差值,存下来的可能是很久之前的服务器时间
      global.setMainBaseData(mainBaseDataObj);
      console.log('=================>基础信息重新赋值了');
    } // end of if
  } // end of if
  if (to.meta.needLogin) {//是否需要登录
    if (global.userInfoObj && global.userInfoObj.token) {
      next();
    } else {
      //console.log('=================>用户信息现在为空了');
      const loginUserInfoObj = loginUserInfo.getLoginUserInfo(true);//用户信息
      if (loginUserInfoObj && loginUserInfoObj.token) {
        global.setUserInfoObj(loginUserInfoObj);
        PubSub.publish('refreshUserInfo');
        console.log('=================>用户信息重新赋值了');
        next();
      } else {
        global.setUserInfoObj(null);
        api.user.getWxLoginUrl().then(data => {
          if (data) {
            Toast('为更好的为您服务,请授权微信登录!');
            setTimeout(() => location.href = data, 1000);
          } else {
            Toast('获取微信登陆参数失败,请重试!');
          }
        });
      }
    }
  } else {
    if (!global.userInfoObj) {
      //console.log('=================>用户信息现在为空啦');
      const loginUserInfoObj = loginUserInfo.getLoginUserInfo(true);//用户信息
      if (loginUserInfoObj && loginUserInfoObj.token) {
        global.setUserInfoObj(loginUserInfoObj);
        PubSub.publish('refreshUserInfo');
        console.log('=================>用户信息重新赋值啦');
      } // end of if
    } // end of if
    next();
  }
});

export default RouterModel;
