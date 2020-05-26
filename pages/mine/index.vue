<template>
	<view class="container">
		<uni-login @onLogin="onLogin"></uni-login>
		<view class="userInfo">
			<view class="baseInfo flex " >
				<view class="headimg" >
					<open-data  type="userAvatarUrl" class="image" ></open-data>
				</view>
				<view  class="tel" >
					<open-data  type="userNickName" class="text-bold" ></open-data>
					<view>垃圾分类小能手 🏅</view>
				</view>
			</view>
		</view>
		<view class="myService">
			<view class="bag-title">我的服务</view>
			<view class="service-list" @click="checkLogin('./history')">
				<view><image class="image" src="/static/images/liulanjilu.png" ></image></view>
				<text>浏览记录</text>
			</view>
			<view class="service-list" @click="checkLogin('./favorite')">
				<view><image class="image" src="/static/images/shoucang.png" ></image></view>
				<text>我的收藏</text>
			</view>
			<view class="service-list" @click="clearCache">
				<view><image class="image" src="/static/images/qingkong.png" ></image></view>
				<text>清理缓存</text>
			</view>
		</view>
		<view class="myService">
			<view class="bag-title">为您推荐</view>
			<button class="service-list" open-type="share">
				<view><image class="image" src="/static/images/fenxiang.png" ></image></view>
				<text>分享好友</text>
			</button>
			<button class="service-list" open-type="contact">
				<view><image class="image" src="/static/images/fankui.png" ></image></view>
				<text>留言反馈</text>
			</button>
		</view>
	    <view class="adContainer">
	        <ad unitId="adunit-b92c9ef13087489c"></ad>
			<ad unit-id="adunit-0fc9b4cb043f6ffa" ad-type="grid" grid-opacity="0.8" grid-count="5" ad-theme="white"></ad>
	    </view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				userInfo:{},
				isLoged:false,
			};
		},
		onLoad() {
			// 获取用户信息
			wx.getSetting({
			  success: res => {
				if (res.authSetting['scope.userInfo']) {
				  // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
				  wx.getUserInfo({
					success: res => {
						this.isLoged = true;
						this.userInfo = res.userInfo;
					}
				  })
				}
			  }
			})
		},
		methods:{
			onLogin(e){
				this.userInfo = e;
				this.isLoged = true;
				this.$store.commit('auth/hideLogin')
			},
			checkLogin(url){
				if(!this.isLoged){
					this.$store.commit('auth/showLogin')
				}else{
					wx.navigateTo({
						url:url,
					})
				}
			},
			clearCache(){
				uni.clearStorage()
				uni.showToast({
					title:'清理成功'
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
	.container {
		width: 100%;
		
		.userInfo{
			width:750rpx;
			height:375rpx;
			background: url('../../static/images/bg.png') no-repeat center center;
			background-size: 100% 100%;
			padding:150rpx 40rpx 40rpx;
			box-sizing:border-box;
			color:#fff;
			.baseInfo{
				.headimg {
					width:110rpx;
					height: 110rpx;
					background:rgba(242,242,242,1);
					border:2rpx solid rgba(255,255,255,1);
					box-shadow:0px 7rpx 10rpx 0rpx rgba(249,175,63,0.24);
					border-radius:50%;
					margin-right:40rpx;
					overflow: hidden;
					.image{
						width:110rpx;
						height: 110rpx;
					}
				}
				.tel{
					padding:18rpx 0 20rpx;
					font-size:28rpx;
				}
				
				.grade{
					padding:4rpx 12rpx;
					font-size:22rpx;
					color:#fff;
					background:linear-gradient(90deg,rgba(255,102,51,1),rgba(255,184,51,1));
					box-shadow:0px 7rpx 10rpx 0rpx rgba(249,175,63,0.24);
					border-radius:2rpx;
				}
			}
		}
		.myService{
			width: 100%;
			padding:0 40rpx;
			background:#fff;
			margin-bottom:20rpx;
			.bag-title {
				height: 80rpx;
				line-height: 80rpx;
				font-size:26rpx;
				border-bottom:1rpx solid #e5e5e5;
			}
			.service-list{
				width: 200rpx;
				text-align:center;
				font-size:22rpx;
				float:left;
				margin-right:22rpx;
				background:#fff;
				padding:0;
				padding-bottom:30rpx;
				line-height:1;
				color:#333;
				
				.image{
					width:63rpx;
					height:63rpx;
					margin:30rpx 0;
				}
			}
		}
	}
</style>
