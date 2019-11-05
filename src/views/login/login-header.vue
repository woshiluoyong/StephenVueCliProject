<template>
	<div class="store_header pt-50 pl-20 pr-20">
		<div class="store_avatar">
			<img src="../../assets/images/img-spalsh-logo.png" alt="logo" width="80" height="80">
		</div>
		<div class="store_name">StephenVueCli</div>
	</div>
</template>


<script>
export default {
  name: 'login-header'
};
</script>

<style lang="scss" scoped>
.store_header {
  text-align: center;
  padding: 30px 0;
  .store_avatar img {
    border-radius: 50%;
  }
  .store_name {
    padding-top: 5px;
    font-size: 16px;
  }
}
</style>
