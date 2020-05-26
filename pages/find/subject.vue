<template>
	<view class="container">
		<uni-nav-bar :statusBar="true" :fixed="true" :title="intro"  />
		<view class="item bg-white" v-for="(item,index) in list" :key="index">
			<view class="flex align-center justify-between">
				<view class="icon">
					<image :src="item.icon" class="image"></image>
				</view>
				<view class="name "><text class="text-bold margin-lr-20">{{item.name}}</text></view>
				<view class="text-32" :class="item.des">{{item.type}}</view>
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
				list:[],
			};
		},
		onShareAppMessage() {
			
		},
		onLoad(options) {
			this._id = options.id;
			this.getDetail()
			
			// 在页面onLoad回调事件中创建插屏广告实例
			if (wx.createInterstitialAd) {
			  interstitialAd = wx.createInterstitialAd({
			    adUnitId: 'adunit-9e05d17823877fa7'
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
			async getDetail(){
				const db = wx.cloud.database();
				db.collection('subject-list').where({
					_id:this._id
				}).get({
					success: res => {
						console.log(res)
						this.intro = res.data[0].name;
						this.list = res.data[0].detail;
					},
					fail: err => {
						wx.showToast({
							icon: 'none',
							title: '查询记录失败'
						})
						console.error('[数据库] [查询记录] 失败：')
					}
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
	.container{
		.item{
			width: 700rpx;
			padding: 40rpx;
			border-radius: 10rpx;
			margin-top: 20rpx;
			.icon{
				width: 80rpx;
				height: 80rpx;
				.image{
					width: 100%;
					height: 100%;
				}
			}
			.name{
				flex: 1;
				text-align: left;
				font-size: 36rpx;
				color: #333;
			}
			.residual{
				color: #3f6ba8;
			}
			.hazardous{
				color: #b43a53;
			}
			.recyclable{
				color: #06a438;
			}
			.household{
				color: #88928a;
			}
		}
	}
</style>
