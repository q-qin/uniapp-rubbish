<template>
	<view class="container">
		<view class="item bg-white flex justify-between align-center" v-for="(item,index) in list" :key="index" @tap="goSubject(item._id)" >
			<view class="icon">
				<image :src="item.icon" class="image"></image>
			</view>
			<view class="name "><text class="text-bold margin-lr-20">{{item.name}}</text></view>
			<uni-icons type="arrowright" size="20"></uni-icons>
		</view>
	    <view class="adContainer">
	        <ad unitId="adunit-ec74b6a0b52888a9"></ad>
			<ad unit-id="adunit-39af6a3844af372f" ad-type="grid" grid-opacity="0.8" grid-count="5" ad-theme="white"></ad>
	    </view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				list:[],
			};
		},
		onLoad() {
			const db = wx.cloud.database();
			db.collection('subject-list').where({}).get({
				success: res => {
					console.log(res)
					this.list = res.data
				},
				fail: err => {
					wx.showToast({
						icon: 'none',
						title: '查询记录失败'
					})
					console.error('[数据库] [查询记录] 失败：')
				}
			})
		},
		onShareAppMessage() {
			
		},
		methods:{
			goSubject(id){
				uni.navigateTo({
					url:'./subject?id='+id
				})
			}
		}
	}
</script>

<style lang="scss">
	.container{
		padding-top: 200rpx;
		.item{
			width: 700rpx;
			padding: 40rpx;
			border-radius: 10rpx;
			margin-bottom: 40rpx;
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
		}
	}
</style>
