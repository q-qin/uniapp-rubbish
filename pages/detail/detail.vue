<template>
	<view class="detail" >
		<uni-nav-bar :statusBar="true" :fixed="true" left-icon="back" :title="intro" @clickLeft="clickLeft" />
	    <view class="box" v-if="!loading">
	        <view class="top">
	            <image alt="" :src="imgUrl"></image>
	            <view>
	            <text style="font-weight: 600; font-size: 36rpx;color: #00adb8;">{{type}}
	            </text>{{detail}}</view>
	        </view>
	        <view class="require" v-if="require.length>0">
	            <text>投放要求</text>
	            <view v-for="(item,index) in require" :key="index">
	                <span class="wx-icon-custom-tishi"></span>
	                {{item}}
	            </view>
	        </view>
	        <view class="title">常见{{type}}</view>
	        <view class="item" v-for="(item,index) in category" :key="index">
	            <text class="tag">{{item.kind}}</text>
	            <view class="example">
	                <text v-for="(c_item,c_index) in item.example" :key="c_index">{{c_item}}</text>
	            </view>
	        </view>
	    </view>
	    <view class="bottom" style="text-align:center;font-size:24rpx;padding:30rpx;" v-if="isOver">
	        <text style="color:#666;">--- 我是有底线的 ---</text>
	    </view>
	    <view class="share">
	        <image hight="20rpx" src="../../static/images/share.png"></image>
	        <text>分享</text>
	        <button openType="share"></button>
	    </view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				intro:'',
				type: "",
				category: [],
				detail: "",
				imgUrl: "",
				require: [],
				loading: true,
				isOver: true,
				navBar:{},
			};
		},
		onShareAppMessage() {
		},
		onLoad(options){
			this.intro = options.intro;
			this.imgUrl = "../../static/images/" + options.desc + ".png";
			this.loadDesc(options.desc);
		},
		methods:{
			clickLeft() {
				uni.navigateBack({
					delta: 1
				})
			},
			loadDesc(str){
				console.log(str);
				var condition = {
				  desc: str
				};
				uni.showLoading({
				    title: '加载中'
				});
				wx.cloud.callFunction({
				  name: "collection_get",
				  data: {
					database: "rubbish",
					page: 1,
					num: 1,
					condition: condition
				  }
				}).then((res)=> {
				  console.log(res);
				  if (res.result.data.length) {
					var data = res.result.data[0];
					this.type = data.type,
					this.category = data.category;
					this.detail = data.detail;
					this.require = data.require;
					this.loading = false;
					uni.hideLoading();
				  } else{ 
					  uni.hideLoading();
					  this.loading = false;
					  this.isOver = true;
				  }
				}).catch(console.error);
			}
		}
	}
</script>

<style lang="scss" scoped>
	.detail {
	    padding: 4rpx  0 30rpx 0;
	    font-size: 32rpx;
	}
	
	.top {
	    padding: 10rpx 0;
	    display: flex;
	    flex-direction: column;
	    align-items: center;
	}
	
	.top image {
	    height: 160rpx;
	    width: 160rpx;
	}
	
	.top view {
	    padding: 20rpx 20rpx 0 20rpx;
	    color: #666666;
	    font-size: 30rpx;
	    line-height: 45rpx;
	}
	
	.require {
	    color: #555;
	    padding: 0 20rpx;
	    font-size: 28rpx;
	    line-height: 1.5;
	}
	
	.require text {
	    display: block;
	    font-size: 30rpx;
	    color: #333;
	    font-weight: bold;
	    padding: 0 20rpx;
	    border-left: 3px solid #00adb8;
	    margin: 20rpx 0;
	}
	
	.require span {
	    color: #ee7171;
	}
	
	.title {
	    font-size: 30rpx;
	    color: #333;
	    font-weight: bold;
	    padding: 0 20rpx;
	    border-left: 3px solid #00adb8;
	    margin: 30rpx 20rpx;
	}
	
	.item {
	    background: #fff;
	    padding: 20rpx 20rpx;
	    margin: 20rpx 0;
	    border-radius: 3rpx;
	    box-shadow: 0px 0px 3px #f1f1f1;
	}
	
	.item .tag {
	    display: block;
	    text-align: center;
	    font-size: 30rpx;
	    color: #444;
	    padding-bottom: 10rpx;
	}
	
	.example {
	    display: flex;
	    flex-wrap: wrap;
	    padding: 0 0 4rpx 0;
	    justify-content: center;
	    align-items: center;
	}
	
	.example text {
	    border: 1px solid #f1f1f1;
	    min-height: 40rpx;
	    line-height: 40rpx;
	    padding: 0rpx 20rpx;
	    background: #ffffff;
	    margin: 10rpx;
	    color: #777;
	    font-size: 24rpx;
	    border-radius: 20rpx;
	}
	
	.backhome {
	    height: 120rpx;
	    width: 120rpx;
	    position: fixed;
	    top: 30rpx;
	    right: 20rpx;
	    display: flex;
	    flex-direction: column;
	    align-items: center;
	    justify-content: center;
	    font-size: 24rpx;
	    background: rgba(255,255,255,.4);
	    border-radius: 50%;
	    box-shadow: 0 0 2px #bbb;
	    z-index: 10;
	}
	
	.backhome image {
	    height: 50rpx;
	    width: 50rpx;
	}
	
	.backhome text {
	    color: #666;
	    font-size: 24rpx;
	}
	
	.share {
	    height: 110rpx;
	    width: 110rpx;
	    position: fixed;
	    bottom: 40rpx;
	    right: 20rpx;
	    display: flex;
	    flex-direction: column;
	    align-items: center;
	    justify-content: center;
	    font-size: 24rpx;
	    background: rgba(0,0,0,.6);
	    border-radius: 50%;
	    z-index: 10;
	}
	
	.share image {
	    height: 50rpx;
	    width: 50rpx;
	}
	
	.share text {
	    color: #fff;
	}
	
	.share button {
	    position: absolute;
	    height: 100%;
	    width: 100%;
	    opacity: 0.1;
	    z-index: 99;
	}
</style>
