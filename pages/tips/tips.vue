<template>
	<view class="tips">
		<uni-nav-bar :statusBar="true" :fixed="true" left-icon="back" title="垃圾分类小贴士" @clickLeft="clickLeft" />
	    <view class="top suggest">
	        <image class="img" src="../../static/images/code.jpg"></image>
	    </view>
	    <view class="suggest">
	        <view class="title">
	            <span class="wx-icon-custom-tishi"></span> 下面都不属于日常生活垃圾</view>
	        <view>👉 牛粪、鸟粪等; 狗屎、猫屎等宠物粪便; 宠物尸体。</view>
	    </view>
	    <view class="suggest">
	        <view class="title">
	            <span class="wx-icon-custom-tishi"></span> 宠物粪便如何处理？</view>
	        <view>👉 宠物主人应该用纸或者塑料袋捡拾，尽可能带回家冲入马桶，污染过的纸张或塑料袋投入干垃圾桶即可。如果难以分开处理，可以装袋（注意扎紧口袋）后放入干垃圾桶。</view>
	    </view>
	    <view class="suggest">
	        <view class="title">
	            <span class="wx-icon-custom-tishi"></span> 装修垃圾</view>
	        <view>👉 废弃马桶、石灰、石头、水泥等都属于装修垃圾 ，请投放到指定的装修垃圾堆放场所。</view>
	    </view>
	    <view class="suggest">
	        <view class="title">
	            <span class="wx-icon-custom-tishi"></span> 大件垃圾</view>
	        <view>👉 床、沙发、茶几、衣柜、桌子、椅子、凳子、油烟机等属于大件垃圾。请询问物业如何投放，或者预约回收经营者上门回收。</view>
	    </view>
	    <view class="suggest">
	        <view class="title">
	            <span class="wx-icon-custom-tishi"></span> 相关资讯</view>
	        <view>👉 2019起，全国地级及以上城市全面启动生活垃圾分类。</view>
	        <view>👉 到2020年底，全国46个重点城市要基本建成垃圾分类处理系统。</view>
	        <view>👉 到2022年，各地级城市至少有1个区实现生活垃圾分类全覆盖，其他各区至少有1个街道基本建成生活垃圾分类示范片区。</view>
	        <view>👉 到2025年，全国地级及以上城市基本建成生活垃圾分类处理系统。</view>
	    </view>
	    <!-- <view class="adContainer">
	        <ad unitId="adunit-56a28d959d8baef5"></ad>
	    </view> -->
	</view>
</template>

<script>
	export default {
		data() {
			return {
				
			};
		},
		onShareAppMessage () {
			return {
			  title: "日常生活垃圾怎么分类？快来查一查",
			  path: "pages/index/index"
			};
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
	.tips {
	    padding: 0 0 40rpx;
	    color: #444;
	    line-height: 1.7;
	    font-size: 28rpx;
	}
	
	.suggest {
	    background: #fff;
	    border: 1px solid #eeeeee;
	    border-radius: 20rpx;
	    margin: 20rpx 0;
	    padding: 20rpx;
	}
	
	.wx-icon-custom-tishi {
	    color: red;
	}
	
	.top {
	    margin: 0;
	    text-align: center;
	}
	
	.top image {
	    height: 300rpx;
	    width: 300rpx;
	}
	
	.title {
	    color: red;
	    padding-bottom: 10rpx;
	}
</style>
