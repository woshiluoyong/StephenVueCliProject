<template>
	<div class="md_field" :class="{md_field_hasIcon: !!icon, md_field_isError: isError}">
		<van-icon v-if="icon" :name="icon" class="md_feld_icon"/>
		<div class="md_field_control">
			<input :type="type" v-on="listeners" v-bind="$attrs" :value="value"/>
		</div>
		<div class="md_field_div">
			<slot v-if="rightIcon" name="rightIcon">
				<van-icon :name="rightIcon" @click="rightClick" v-show="value"/>
			</slot>
      <slot v-if="rightBtn" name="rightBtn">
				<van-button type="danger" size="small" @click="rightClick" class="w-90 bgTheme">{{rightTxt}}</van-button>
			</slot>
		</div>
	</div>
</template>

<script>
export default {
  name: 'md-field',
  props: {
    value: {},
    type: {
      type: String,
      default: 'text'
    },
    rightIcon: String,
    rightBtn: String,
    rightTxt: String,
    icon: String,
    isError: Boolean
  },
  computed: {
    listeners() {
      return {
        ...this.$listeners,
        input: this.onInput
      };
    }
  },
  methods: {
    onInput(event) {
      this.$emit('input', event.target.value);
    },
    rightClick(event) {
      this.$emit('right-click', event);
    }
  }
};
</script>

<style lang="scss" scoped>
.md_field {
  position: relative;
  border-bottom: 1px solid $border-color;
  padding-top: 10px;
  padding-bottom: 10px;
  padding-left: 5px;
  display: flex;
  width: 100%;
  box-sizing: border-box;
  background-color: #fff;
  > div {
    display: table-cell;
  }
  > .md_field_control {
    flex: 0.65;
    padding-right: 10px;
    box-sizing: border-box;
    input {
      border: 0;
      line-height: 14px;
      font-size: 15px;
      width: 100%;
    }
  }
  > .md_field_div {
    flex: 0.35;
    text-align: center
  }
  .md_feld_icon {
    position: absolute;
    top: 50%;
    left: 10px;
    transform: translate(0, -50%);
  }
}

.md_field_hasIcon {
  padding-left: 40px;
}

.md_field_isError {
  color: $red;
  background-color: #fcf5f5;
  border: 1px solid $red;
  input {
    color: $red;
    background-color: #fcf5f5;
  }
  input:-webkit-autofill {
    -webkit-box-shadow: 0 0 0 1000px #fcf5f5 inset !important;
  }
}
</style>
