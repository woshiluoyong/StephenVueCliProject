import { Toast } from 'vant';

export default {
  isWechat:function(){
    var ua = window.navigator.userAgent.toLowerCase();
    if(ua.match(/micromessenger/i) == 'micromessenger'){
      return true;
    }else{
      return false;
    }
  },
  jsApiCall(data ,callback_succ_func ,callback_error_func){
    WeixinJSBridge.invoke('getBrandWCPayRequest', {//使用原生的，避免初始化appid问题
      appId: data.appId,
      timeStamp: data.timeStamp,
      nonceStr: data.nonceStr, // 支付签名随机串，不长于 32 位
      package: data.packAge, // 统一支付接口返回的prepay_id参数值，提交格式如：prepay_id=\*\*\*）
      signType: data.signType, // 签名方式，默认为'SHA1'，使用新版支付需传入'MD5'
      paySign: data.paySign, // 支付签名
    }, function(res) {
      var msg = res.err_msg ?res.err_msg :res.errMsg;
      console.log('==============微信支付返回===>',msg);
      switch (msg) {
        case 'get_brand_wcpay_request:ok': //支付成功时
          if(callback_succ_func)callback_succ_func(res);
          break;
        default: //支付失败时
          console.log('=================>微信支付失败,Msg:'+msg);
          if(callback_error_func)callback_error_func({ msg });
          break;
      }
    })
  },
  payment:function(data ,callback_succ_func ,callback_error_func){
    if(!this.isWechat()){
      Toast('当前未在微信上操作,无法完成微信支付!');
      return;
    } // end of if
    if (typeof WeixinJSBridge == 'undefined') {
      if (document.addEventListener) {
        document.addEventListener('WeixinJSBridgeReady', this.jsApiCall, false);
      } else if (document.attachEvent) {
        document.attachEvent('WeixinJSBridgeReady', this.jsApiCall);
        document.attachEvent('onWeixinJSBridgeReady', this.jsApiCall);
      }
    } else {
      this.jsApiCall(data ,callback_succ_func ,callback_error_func);
    }
  }
}