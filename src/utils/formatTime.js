// 时间格式化处理
export function dateFormat(fmt,date) {
  const o = {
    'M+' : date.getMonth() + 1,// 月份
    'd+' : date.getDate(),// 日
    'h+' : date.getHours(),// 小时
    'm+' : date.getMinutes(),// 分
    's+' : date.getSeconds(),// 秒
    'q+' : Math.floor((date.getMonth() + 3) / 3), // 季度
    'S'  : date.getMilliseconds()// 毫秒
  };
  if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (date.getFullYear() + '').substr(4 - RegExp.$1.length));
  for (const k in o) if (new RegExp('(' + k + ')').test(fmt))fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (('00' + o[k]).substr(('' + o[k]).length)));
  return fmt;
}

export function getFormatDate(dateMill, formatStr) {
  return dateFormat(formatStr || 'yyyy-MM-dd hh:mm:ss',dateMill ? new Date(dateMill) : new Date());
}

export function getFormatDateNotDefault(dateMill, formatStr) {
  return dateMill ? dateFormat(formatStr || 'yyyy-MM-dd hh:mm:ss',new Date(dateMill)) : '';
}

export function addDate(days, curDate, formatStr) {
  if (!curDate) curDate = new Date();
  curDate.setDate(curDate.getDate() + days);// 天数(接受正/负值)
  // const m = curDate.getMonth() + 1;
  return formatStr ? getFormatDate(curDate.getTime(), formatStr) : curDate;
}

export function formatMinDate(min) {
  const result = min * 60;
  const h = Math.floor(result / 3600) < 10 ? '0' + Math.floor(result / 3600) : Math.floor(result / 3600);
  const m = Math.floor(((result / 60) % 60)) < 10 ? '0' + Math.floor(((result / 60) % 60)) : Math.floor(((result / 60) % 60));
  const s = Math.floor((result % 60)) < 10 ? '0' + Math.floor((result % 60)) : Math.floor((result % 60));
  return h + '小时' + m + '分';// + s + '秒';
}

const formatTime = date => {
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();
  const hour = date.getHours();
  const minute = date.getMinutes();
  const second = date.getSeconds();

  return (
    `${[year, month, day].map(formatNumber).join('-')}  ${[hour, minute, second].map(formatNumber).join(':')}`
  );
};

const formatNumber = num => {
  let n = num;
  n = n.toString();
  return n[1] ? n : `0${n}`;
};

export default formatTime;
