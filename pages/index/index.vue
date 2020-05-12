<template>
	<view class="container">
		<uni-favtip></uni-favtip>
	    <view class='banner'>
	        <image src='../../static/images/bg.png'></image>
	        <view class='topBox'>
	            <view class='tt'>垃圾分类</view>
	            <view class="title" @longpress='goError'>配合垃圾分类, 争做文明市民</view>
	            <view @tap="goSearch" class="top">
	                <view class="search">
	                  <image src="../../static/images/searchbg.png"></image>
	                  <!-- <input disabled placeholder="日常生活垃圾分类查询"></input> -->
	                </view>
	            </view>
	        </view>
	
	    </view>
	   
	    <!-- <button style="width:100%" class="tip" @tap="addrecord">新增</button> -->
	    <view class="box">
	        <view @tap="goDetail" data-desc="recyclable" data-intro="可回收物">
	            <image class="img" mode="aspectFit" src="../../static/images/khs.png"></image>
	             <view class='des'>可回收物</view>
	        </view>
	        <view @tap="goDetail" data-desc="hazardous" data-intro="有害垃圾">
	            <image class="img" src="../../static/images/yh.png"></image>
	            <view class='des'>有害垃圾</view>
	        </view>
	        <view @tap="goDetail" data-desc="household" data-intro="湿垃圾">
	            <image class="img" src="../../static/images/cy.png"></image>
	            <view class='des'>湿垃圾</view>
	        </view>
	        <view @tap="goDetail" data-desc="residual" data-intro="干垃圾">
	            <image class="img" src="../../static/images/qq.png"></image>
	             <view class='des'>干垃圾</view>
	        </view>
	    </view>
	    
	    <view class="suggest">
	        <view @tap="goTips" class="tip">小贴士</view>
	        <button class="share" openType="share" type="primary"><image src='../../static/images/wx.png'></image> 分享给朋友</button>
	        <!-- <button openType="contact">反馈</button> -->
	    </view>
	    <!-- <view class="options">
	        <button class="share" openType="share" type="primary">分享给朋友</button>
	    </view> -->
	    <view class="notice">
	        <view class="tips">
	            <span class="wx-icon-custom-tishi"><image src='../../static/images/icon_ts.png'></image></span>
	      友情提醒
	    </view>
	        <view class="content">本系统仅供参考，具体分类要求以属地专业管理部门为准。如果发现系统中有不当之处，请留言反馈，非常感谢！</view>
	    </view>
	    <!-- <view class="adContainer">
	        <ad unitId="adunit-0ae3a247d1891eaa"></ad>
	    </view> -->
		<view class="bannerIMG" v-if="banner">
			<image class="uni-image" :src="banner" @tap="viewer" ></image>
		</view>
		<view class="bg-mask" v-if="dialogShow">
			<view class="bg-white">
				<image class="uni-image" :src="dialogIMG" ></image>
				<view class="close" @tap="dialogShow=false;">关闭</view>
			</view>
		</view>
	</view>
</template>

<script>
	const app = getApp();
	
	export default {
		data() {
			return {
				banner:'',
				dialogIMG:'',
				dialogShow:false,
			}
		},
		onLoad() {
			this.getBanner()
		},
		onShareAppMessage() {
			return {
			  title: "日常生活垃圾怎么分类？快来查一查",
			  path: "pages/index/index"
			};
		},
		methods: {
			async getBanner(){
				const res = await wx.cloud.callFunction({
					name: "banner_get",
					data: {
						position:'index'
					}
				})
				if (res.result.data.length > 0){
					this.banner = res.result.data[0].picture;
					this.dialogIMG = res.result.data[0].url;
				}
			},
			viewer(){
				this.dialogShow = true;
			},
			goError(){
				wx.navigateTo({
					url: '/pages/error/list',
				})
			},
			goSearch(){
				wx.navigateTo({
				  url: "/pages/search/search"
				});
			},
			goTips() {
				wx.navigateTo({
				  url: "/pages/tips/tips"
				});
			},
			goDetail(e){
				var desc = e.currentTarget.dataset.desc, intro = e.currentTarget.dataset.intro;
				wx.navigateTo({
				  url: "/pages/detail/detail?desc=" + desc + "&intro=" + intro
				});
			}
		}
	}
</script>

<style lang="scss" scoped>
	.container {
	}
	.swiper{
		width: 100vw;
	}
	.banner{
	  width: 750rpx;
	  height:375rpx;
	  position: relative;
	
	}
	.banner image{
	  width: 750rpx;
	  height: 375rpx;
	}
	.topBox{
	  width: 750rpx;
	  height: 375rpx;
	  position: absolute;
	  left: 0;
	  top: 0;
	}
	.topBox .tt{
	  text-align: center;
	  font-size: 32rpx;
	  color: #ffffff;
	  font-weight: bold;
	  padding-top: 150rpx;
	}
	.topBox  .title {
	    font-size: 26rpx;
	    color: #ffffff;
	    text-align: center;
	    padding: 20rpx 0 10rpx 0;
	}
	
	.top {
	    position: relative;
	    padding: 20rpx 20rpx;
	}
	
	.top .search {
	    width: 557rpx;
	    height: 56rpx;
	    position: relative;
	    margin: 0 auto;
	}
	
	.top .search image {
	    width: 557rpx;
	    height: 56rpx;
	    position: absolute;
	    left: 0;
	    top: 0;
	}
	
	.top input {
	    border: none;
	    flex: 1;
	}
	
	.box {
	    margin: 20rpx auto 20rpx;
	    padding: 0 30rpx;
	}
	
	.box view {
	    display: inline-block;
	    width: 50%;
	    text-align: center;
	    margin-top: 20rpx;
	}
	
	.img {
	    width: 169rpx;
	    height: 169rpx;
	    display: block;
	    margin: 0 auto;
	}
	.box view .des{
	  font-size: 26rpx;
	  color: #666666;
	}
	
	.notice {
	    padding: 20rpx 40rpx;
	    font-size: 26rpx;
	}
	
	.notice .tips {
	    color: #444;
	    line-height: 50rpx;
	    font-weight: 600;
	    font-size: 28rpx;
	}
	
	.notice .tips span {
	    color: #eb3333;
	    width: 30rpx;
	    height: 30rpx;
	}
	.notice .tips span image{
	    width: 30rpx;
	    height: 30rpx;
	}
	
	.notice .content {
	    line-height: 1.5;
	    font-size: 24rpx;
	    color: #999999;
	}
	
	.suggest {
	    padding: 10px 60rpx;
	    display: flex;
	    justify-content: space-between;
	}
	
	.tip {
	    width: 300rpx;
	    height: 80rpx;
	    line-height: 80rpx;
	    font-size: 28rpx;
	    text-align: center;
	    background-color: #00adb8;
	    color: #fff;
	    border-radius: 40rpx;
	    margin: 0 20rpx;
	
	
	}
	
	.suggest button {
	    width: 300rpx;
	    height: 80rpx;
	    line-height: 80rpx;
	    color: #ffffff;
	    background: #0cc160;
	    font-size: 28rpx;
	    border-radius: 40rpx;
	    padding: 0;
	    margin: 0 20rpx;
	}
	.suggest button image{
	  width: 50rpx;
	  height: 50rpx;
	  vertical-align: middle;
	}
	.suggest button::after {
	    border: none;
	    width: 0;
	    height: 0;
	}
	
	.options {
	    display: flex;
	    align-items: center;
	    justify-content: center;
	    padding: 4rpx 0 30rpx 0;
	}
	
	.options button {
	    width: 80%;
	    height: 80rpx;
	    font-size: 32rpx;
	}
	.bannerIMG{
		width: 100vw;
		height: 100rpx;
	}
	.uni-image{
		width: 100%;
		height: 100%;
	}
	.bg-mask{
		position: fixed;
		top: 0;
		bottom: 0;
		left: 0;
		right: 0;
		background: tgba(0,0,0,.5);
		z-index: 1000;
		.bg-white{
			width: 470rpx;
			height: 535rpx;
			background: #fff;
			position: absolute;
			top: 50%;
			left: 0;
			right: 0;
			margin: auto;
			transform: translateY(-50%);
			.close{
				width: 140rpx;
				text-align: center;
				padding: 10rpx 20rpx;
				margin: 40rpx auto;
				background: #fff;
				color: #333;
				border-radius: 100rpx;
			}
		}
	}
</style>
