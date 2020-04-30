<template>
	<view class="container">
	  <uni-nav-bar :statusBar="true" :fixed="true" left-icon="back" title="userConsole" @clickLeft="clickLeft" />
	  <view class="list">
	    <view class="list-item" >
	      <text class="request-text">用户 openid 获取成功</text>
	    </view>
	    <view class="list-item" >
	      <text class="request-text">{{openid}}</text>
	    </view>
	  </view>
	
	  <!-- 云开发用户管理指引 -->
	  <view class="guide">
	    <text class="headline">云开发管理用户</text>
	    <text class="p">1. 打开云开发控制台</text>
	    <text class="p">2. 切换到 "用户管理" 标签页</text>
	    <text class="p">3. 查看访问小程序的用户列表</text>
	  </view>
	</view>
</template>

<script>
	const app = getApp();
	export default {
		data() {
			return {
				openid:''
			};
		},
		onLoad() {
			this.openid = app.globalData.openid;
		},
		methods:{
			clickLeft(){
				uni.navigateBack({
					delta:1
				})
			},
		}
	}
</script>

<style lang="scss" scoped>
	@import '../../styles/guide.css';
</style>
