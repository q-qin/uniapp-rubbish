<template>
	<view class="box" v-if="showTip" :style="_tipTop">
	  <view class='arrow'></view>
	  <view class='body' @click="hidetip">
			<text>点击「添加到我的小程序」，下次访问更便捷。 ×</text>
	  </view>
	</view>
</template>

<script>
	const app = getApp();
	export default {
		name: "UniFavtip",
		data() {
			return {
				showTip:false,
			};
		},
		computed:{
			_tipTop(){
				return `top:${app.globalData.statusBarHeight + 90}rpx`
			}
		},
		mounted(){
			// 判断是否已经显示过
			let cache = uni.getStorageSync('favorite-tip');
			if (cache) return;
			// 没显示过，则进行展示
			this.showTip = true;
		},
		methods:{
			hidetip(){
				this.showTip = false;
				uni.setStorage({
					key:'favorite-tip',
					data:true,
				})
			},
		}
	}
</script>

<style scoped>
	.box {
	  position: fixed;
	  top: 0;
	  right: 0;
	  z-index: 999;
	  display: flex;
	  justify-content: flex-end;
	  align-items: flex-end;
	  flex-direction: column;
	  transform: translateY(-15rpx);
	}
	.arrow {
	  width: 0;
	  height: 0;
	  margin-right: 140rpx;
	  border-width: 20rpx;
	  border-style: solid;
	  border-color:  transparent transparent rgba(0,0,0,.6) transparent;
	}
	.body {
	  background-color: rgba(0,0,0,.6);
	  box-shadow: 0 10rpx 20rpx -10rpx #000;
	  border-radius: 12rpx;
	  display: flex;
	  align-items: center;
	  justify-content: center;
	  height: 84rpx;
	  padding: 0 20rpx;
	  margin-right: 40rpx;
	}
	.body > text {
	  color: #FFF;
	  font-size: 24rpx;
	  font-weight: 400;
	}
</style>
