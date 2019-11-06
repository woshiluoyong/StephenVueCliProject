# Stephen的Vue微信商业项目快速开发脚手架

> 使用有赞移动端 Vue 组件库 — [Vant](https://youzan.github.io/vant/#/zh-CN/intro)

> 本项目封装了网络axios请求框架逻辑,集成分页逻辑,loading是否展现,请求参数/返回数据log输出

> 本项目封装了微信登陆检测及回调逻辑,可精确控制在具体某页上需要登录

> 本项目封装了微信支付及回调确认逻辑,可方便集成微信H5支付

> 本项目预置了一堆样式简写模版,可快速搭建页面样式,下拉刷新/上拉加载也是基本公共的,使用非常方便

> 本项目预置了vconsole调试库,方便在微信里面调试逻辑,main.js里面可打开使用

> 组件通信使用 pubsub-js, 具体使用可参数src/views/pages下逻辑或文档

> vue.config.js里面的devServer->proxy默认开启了调试时跨域,无需在chrome上加命令了

> 具体clone项目体验绝对巴适!

### 如果有任何使用问题,可扫码以下微信二维码联系我(请备注"来自github"),热枕为您解答
![作者二维码](https://github.com/woshiluoyong/StephenVueCliProject/blob/master/screenShot/my_wx_code.jpg)

## Build Setup

``` shell
# install dependencies
npm install

# serve with hot reload at localhost:xxxx
npm start

# build for production with minification
npm run build
```

>> ## 本项目框架已成功应用于"纵横智停"项目,微信可搜索"纵横智停"公众号体验 
>> ## [纵横智停](http://wx.cdhuanyu.com.cn/) ==> 部分页面需微信打开浏览

>> ### 最后，展示截图(如果截图抽风没展示出来，请在screenShot文件夹下查看):

<p>
	<img src="https://github.com/woshiluoyong/StephenVueCliProject/blob/master/screenShot/1.jpg" alt="纵横智停H5截图"  width="200" height="350">
    <img src="https://github.com/woshiluoyong/StephenVueCliProject/blob/master/screenShot/2.jpg" alt="纵横智停H5截图"  width="200" height="350">
    <img src="https://github.com/woshiluoyong/StephenVueCliProject/blob/master/screenShot/3.jpg" alt="纵横智停H5截图"  width="200" height="350">
    <img src="https://github.com/woshiluoyong/StephenVueCliProject/blob/master/screenShot/4.jpg" alt="纵横智停H5截图"  width="200" height="350">
</p>
