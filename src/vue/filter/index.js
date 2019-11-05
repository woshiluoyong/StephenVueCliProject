import dayjs from 'dayjs';
import { isNumber } from 'lodash';
import { formatMinDate, getFormatDate } from '@/utils/formatTime';

export const dateFormat = (value, format = 'YYYY-MM-DD') => value ? dayjs(value * 1000).format(format) : '';

export const yuan = value => isNumber(value) ? `¥ ${(value).toFixed(2)}` : value;

const filterOrderStatus = (flag) => {
  flag = flag ? parseInt(flag) : 0;
  switch (flag) {
    case 0: return '计费中';
    case 1: return '已完成';
    case 2: return '异常订单';
    default: return '';
  } // end of switch
}

const filterOrderStatusDesc = (flag) => {
  flag = flag ? parseInt(flag) : 0;
  switch (flag) {
    case 0: return '订单正在进行中';
    case 1: return '订单已完成,感谢您的使用';
    case 2: return '订单出现异常';
    default: return '';
  } // end of switch
}

const filterMinDate = (value) => {
  return formatMinDate(value);
}

const filterFormatDate = (dateMill, formatStr) => {
  return getFormatDate(dateMill, formatStr);
}

const filterPaymentMode = (flag) => {
  flag = flag ? parseInt(flag) : 0;
  switch (flag) {
    case 0: return '余额支付';
    default: return '';
  } // end of switch
}

const filterReChargeOrderStatus = (flag) => {
  flag = flag ? parseInt(flag) : 0;
  switch (flag) {
    case 0: return '未支付';
    case 1: return '已支付';
    case 2: return '已取消';
    case -1: return '支付失败';
    default: return '';
  } // end of switch
}

const filterReChargeResultType = (flag) => {
  flag = flag ? parseInt(flag) : 0;
  switch (flag) {
    case 0: return '充值消费';
    case 1: return '月卡缴费';
    case 2: return '提现';
    case 3: return '取消提现';
    case 4: return '临停消费';
    case 5: return '充电消费';
    default: return '';
  } // end of switch
}

const filterReChargeType = (flag) => {
  flag = flag ? parseInt(flag) : 0;
  switch (flag) {
    case 1: return '+';// '增加';
    case 2: return '-';// '扣除';
    default: return '';
  } // end of switch
}

const filterRefundPaymentType = (flag) => {
  switch (flag) {
    case 'wechat_pay': return '微信公众号支付';
    case 'app_weixin': return '微信';
    case 'app_alipay': return '支付宝';
    default: return '';
  } // end of switch
}

const filterRefundResultType = (flag) => {
  flag = flag ? parseInt(flag) : 0;
  switch (flag) {
    case 0: return '提现申请';
    case 1: return '提现成功';
    case 2: return '提现失败';
    case 3: return '取消提现';
    default: return '';
  } // end of switch
}

export default {
  install(Vue) {
    Vue.filter('yuan', yuan);
    Vue.filter('dateFormat', dateFormat);
    Vue.filter('filterOrderStatus', filterOrderStatus);
    Vue.filter('filterOrderStatusDesc', filterOrderStatusDesc);
    Vue.filter('filterMinDate', filterMinDate);
    Vue.filter('filterFormatDate', filterFormatDate);
    Vue.filter('filterPaymentMode', filterPaymentMode);
    Vue.filter('filterReChargeOrderStatus', filterReChargeOrderStatus);
    Vue.filter('filterReChargeResultType', filterReChargeResultType);
    Vue.filter('filterReChargeType', filterReChargeType);
    Vue.filter('filterRefundPaymentType', filterRefundPaymentType);
    Vue.filter('filterRefundResultType', filterRefundResultType);
  }
};
