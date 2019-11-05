<template>
	<div class="mainDiv">
    <van-nav-bar title="绑定号码" left-text="返回" left-arrow @click-left="onClickLeft"/>
		<login-header />
		<login-request />
	</div>
</template>

<script>
import loginHeader from './login-header';
import loginRequest from './login-request';

export default {
  components: {
    [loginHeader.name]: loginHeader,
    [loginRequest.name]: loginRequest
  },
  methods: {
    onClickLeft() {
      history.go(-1);
    }
  }
};
</script>

<style lang="scss" scoped>
.mainDiv {
  position: relative;
  background-color: #fff;
}
</style>
