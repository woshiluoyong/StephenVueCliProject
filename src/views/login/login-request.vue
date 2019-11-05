<template>
	<div class="pt-20 pl-20 pr-20">
		<md-field-group>
			<md-field
				v-model="phoneNum"
        placeholder="请输入手机号"
				right-icon="clear-full"
        name="phoneNum"
				@right-click="clearText"/>
      <div class="pt-10"/>
			<md-field
				v-model="checkCode"
        placeholder="请输入验证码"
				type="text"
				right-btn="YES"
        :right-txt="showTimeText"
        name="checkCode"
				@right-click="sendSmsCode()"/>
      <div class="pt-20"/>
			<van-button size="normal" type="danger" class="bgTheme" style="width: 100%" @click="loginSubmit">绑定登录</van-button>
		</md-field-group>
    <div class="mt-25 pb-20 tc">
      <van-checkbox v-model="isCheckProtocal" class="dl protocal-check-box"></van-checkbox>
      <span @click="isShowProtocal = true">《StephenVueCli用户绑定协议》</span>
    </div>

    <van-popup v-model="isShowProtocal" position="bottom" :style="{ height: '45%' }" class="pl-10 pt-10 pb-10 pr-10" closeable>
      <span v-html="protocalUserHtml"></span>
    </van-popup>
	</div>
</template>

<script>
import PubSub from 'pubsub-js';
import field from '@/vue/components/field/';
import fieldGroup from '@/vue/components/field-group/';
import { loginUserInfo } from '@/utils/jsLocalS'
import global from '@/utils/globalVar'
import ComponentUtil from '@/utils/componentUtil';
import { protocalUserHtml } from '@/utils/protocalHtml';

import api from '@/api'

export default {
  name: 'login-request',
  components: {
    [field.name]: field,
    [fieldGroup.name]: fieldGroup
  },
  data() {
    return {
      phoneNum: '',
      checkCode: '',
      showTimeText: '获取验证码',
      isCheckProtocal: false,
      isShowProtocal: false,
      protocalUserHtml
    };
  },
  beforeDestroy() {
    ComponentUtil.stopCodeDownTimer();
  },
  methods: {
    clearText() {
      this.phoneNum = '';
    },
    sendSmsCode() {
      if (this.showTimeText != '获取验证码')return;
      if (!this.phoneNum || !ComponentUtil.validateTel(this.phoneNum)) {
        this.$toast('请输入正确的手机号!');
        return;
      } // end of if
      const self = this;
      api.user.sendLoginCode(this.phoneNum).then(data => {
        self.$toast('验证码发送成功,请注意查收!');
        ComponentUtil.startCodeDownTimer((isCompleted, timeLeft, showTimeText) => {
          self.showTimeText = isCompleted ? '获取验证码' : showTimeText;
        });
      });
    },
    loginSubmit() {
      if (!this.isCheckProtocal) {
        this.$toast('请阅读并同意用户绑定协议!');
        return;
      } // end of if
      if (!this.phoneNum || !ComponentUtil.validateTel(this.phoneNum)) {
        this.$toast('请输入正确的手机号!');
        return;
      } // end of if
      if (!this.checkCode) {
        this.$toast('请输入验证码!');
        return;
      } // end of if
      api.user.userBindPhone({ mobile: this.phoneNum, yzmCode: this.checkCode, weiXinUserId: this.$route.query.weiXinUserId }).then(data => {
        this.$toast('绑定手机号成功,现在可以正常使用了!');
        global.setUserInfoObj(data);
        loginUserInfo.setLoginUserInfo(JSON.stringify(data));
        PubSub.publish('refreshUserInfo');
        history.go(-1);
      });
    }
  }
};
</script>

<style lang="scss" scoped>
@import '../../assets/scss/mixin';
.protocal-check-box {
  vertical-align: text-bottom;
  position: relative;
  top: 2px;
}
</style>
