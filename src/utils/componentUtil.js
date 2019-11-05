import api from '@/api';
import global from '@/utils/globalVar';
import { loginUserInfo } from '@/utils/jsLocalS'

const sumDownTime = 120;// 总到计时(秒)
let timeLeft = sumDownTime;// 当前时间
let downInterval = null;// 倒计时实例
export default {
  isInteger(num) { // 任何整数都会被1整除，即余数是0。利用这个规则来判断是否是整数
    return (!isNaN(num) && num % 1 === 0);
  },
  validateTel(phoneNum) {
    return /^1\d{10}$/.test(phoneNum);
  },
  updateLoginUserMoneyData(callBack) {//更新用户余额
    api.user.getUserMoney().then(data => {
      if (data) {
        const curUserInfo = global.userInfoObj;
        curUserInfo.remainMoney = data.remainMoney || 0;
        global.setUserInfoObj(curUserInfo);
        loginUserInfo.setLoginUserInfo(JSON.stringify(curUserInfo));
        console.log('=================>更新用户余额完成!');
        typeof(callBack) === 'function' && callBack(curUserInfo.remainMoney);
      } // end of if
    });
  },
  startCodeDownTimer(callBack) {
    this.stopCodeDownTimer();
    downInterval = setInterval(() => {
      if (timeLeft < 1) {
        this.stopCodeDownTimer();
        callBack(true, timeLeft, sumDownTime + 's后重发');
      } else {
        timeLeft -= 1;
        callBack(false, timeLeft, (timeLeft < 10 ? ('0' + timeLeft) : timeLeft) + 's后重发');
      }
    }, 1000)
  },
  stopCodeDownTimer() {
    if (downInterval) clearInterval(downInterval);
    downInterval = null;
    timeLeft = sumDownTime;
  }
};
