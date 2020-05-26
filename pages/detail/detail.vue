<template>
	<view class="detail" >
		<uni-nav-bar :statusBar="true" :fixed="true" :title="intro"  />
	    <view class="box" v-if="!loading">
			<uni-fav class="myfav" v-if="canFav" :checked="checked" bg-color-checked="#00adb8" @click="updateFvorite"></uni-fav>
	        <view class="top" >
	            <image alt="" :src="imgUrl"></image>
	            <view class="des" :class="des">
					<text style="font-weight: bold; font-size: 40rpx;" class="margin-right-10">{{type}}</text>
					{{detail}}
				</view>
	        </view>
	        <view class="require" v-if="require.length>0">
	            <text class="title">投放要求</text>
	            <view class="block" v-for="(item,index) in require" :key="index">
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
			<view class="bottom" v-if="isOver">
				<text class="endline">我是有底线的</text>
			</view>
			<view class="share">
				<image hight="20rpx" src="../../static/images/share.png"></image>
				<text>分享</text>
				<button openType="share"></button>
			</view>
	    </view>
	</view>
</template>

<script>
	// 在页面中定义插屏广告
	let interstitialAd = null
	export default {
		data() {
			return {
				intro:'',
				des:"",
				type: "",
				category: [],
				detail: "",
				imgUrl: "",
				require: [],
				loading: true,
				isOver: true,
				homeIcon:false,
				checked:false,
				detailId:0,
				canFav:true,
				myFavorite:[],
			};
		},
		onShareAppMessage() {
		},
		onLoad(options){
			console.log(options)
			this.detailId = options._id;
			this.des = options.desc;
			this.intro = decodeURIComponent(options.intro);
			this.imgUrl = "../../static/images/" + options.desc + ".png";
			if(['干垃圾','有害垃圾','可回收物','湿垃圾'].find(v=>v == this.intro)){
				this.canFav = false;
			}
			this.loadDesc(options.desc);
			this.getFavStatus(options._id);
			
			// 在页面onLoad回调事件中创建插屏广告实例
			if (wx.createInterstitialAd) {
			  interstitialAd = wx.createInterstitialAd({
			    adUnitId: 'adunit-53045eeeac1f2d7d'
			  })
			  interstitialAd.onLoad(() => {})
			  interstitialAd.onError((err) => {})
			  interstitialAd.onClose(() => {})
			}
		},
		onShow() {
		  // 在适合的场景显示插屏广告
		  if (interstitialAd) {
		    interstitialAd.show().catch((err) => {
		      console.error(err)
		    })
		  }
		},
		methods:{
			updateFvorite(){
				if(!this.checked){
					this.myFavorite.push({
						_id:this.detailId,
						type:this.type,
						name:this.intro,
						des:this.des
					})
				}else{
					let favIndex = this.myFavorite.findIndex(v=>v._id==this.detailId)
					this.myFavorite.splice(favIndex,1)
				}
				uni.setStorage({
					key:'myFavorite',
					data:JSON.stringify(this.myFavorite)
				})
				this.checked = !this.checked;
			},
			getFavStatus(id){
				this.myFavorite = JSON.parse(uni.getStorageSync('myFavorite') || '[]')
				if(this.myFavorite.findIndex(v=>v._id==id) > -1 ){
					// 已收藏
					this.checked = true;
				}
			},
			async loadDesc(str){
				console.log(str);
				var condition = {
				  desc: str
				};
				uni.showLoading({
				    title: '加载中'
				});
				let res = await wx.cloud.callFunction({
				  name: "collection_get",
				  data: {
					database: "rubbish",
					page: 1,
					num: 1,
					condition: condition
				  }
				})
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
			}
		}
	}
</script>

<style lang="scss" scoped>
	.detail {
	    padding: 0 0 30rpx 0;
	    font-size: 32rpx;
	}
	.box{
		position: relative;
	}
	.myfav{
		position: absolute;
		top: 20rpx;
		right: 20rpx;
	}
	
	.top {
	    display: flex;
	    flex-direction: column;
	    align-items: center;
		color: #fff;
		margin: 20rpx;
		.residual{
			background: #3f6ba8;
		}
		.hazardous{
			background: #b43a53;
		}
		.recyclable{
			background: #06a438;
		}
		.household{
			background: #88928a;
		}
	}
	
	.top image {
	    height: 160rpx;
	    width: 160rpx;
	}
	
	.top .des {
		padding: 30rpx;
	    font-size: 30rpx;
	    line-height: 45rpx;
		margin-top: 20rpx;
		border-radius: 10rpx;
	}
	
	.require {
	    color: #555;
	    padding: 0 20rpx;
	    font-size: 30rpx;
		line-height: 45rpx;
	}
	
	.require .title {
	    display: block;
	    font-size: 30rpx;
	    color: #333;
	    font-weight: bold;
	    padding: 0 20rpx;
	    border-left: 3px solid #00adb8;
	    margin: 20rpx 0;
	}
	
	.require .block {
		line-height: 45rpx;
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
	    margin: 20rpx;
	    border-radius: 3rpx;
	    box-shadow: 0px 0px 3px #f1f1f1;
	}
	
	.item .tag {
	    display: block;
	    text-align: left;
	    font-size: 30rpx;
	    color: #444;
		margin: 10rpx;
	    padding-bottom: 10rpx;
	}
	
	.example {
	    display: flex;
	    flex-wrap: wrap;
	    padding: 0 0 4rpx 0;
	    justify-content: flex-start;
	    align-items: center;
	}
	
	.example text {
	    border: 1px solid #f1f1f1;
	    min-height: 40rpx;
	    line-height: 40rpx;
	    padding: 0rpx 20rpx;
	    background: #ffffff;
	    margin: 10rpx 10rpx 10rpx 0;
	    color: #777;
	    font-size: 24rpx;
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
	.bottom{
		text-align:center;
		font-size:24rpx;
		padding:30rpx;
		.endline{
			color:#999;
			position: relative;
			display: inline-block;
			&::before{
				content: '';
				width: 80rpx;
				height: .5px;
				background: #e5e5e5;
				position: absolute;
				left: 0;
				top: 50%;
				transform: translate(-120%,-50%);
			}
			&::after{
				content: '';
				width: 80rpx;
				height: .5px;
				background: #e5e5e5;
				position: absolute;
				right: 0;
				top: 50%;
				transform: translate(120%,-50%);
			}
		}
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
