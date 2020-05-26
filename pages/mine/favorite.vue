<template>
	<view class="container">
		<uni-nav-bar :statusBar="true" :fixed="true"  title="我的收藏" />
		<view @tap="goDetail(item)" class="list-item" v-for="(item,index) in list" :key="index">
			<view class="flex align-center justify-between">
				<view class="text-32">{{item.name}}</view>
				<view class="text-30" :class="item.des">{{item.type}}</view>
			</view>
		</view>
		<view class="no-data" v-if="list.length == 0 && isOver">
			暂无数据
		</view>
		<button type="primary" class="margin-top-50 " style="border-radius: 10rpx;" plain size="mini" @click="clearData">清空记录</button>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				list:[],
				isOver:false,
			};
		},
		onLoad(){
			uni.showLoading({
				title:'加载中'
			})
			try{
				this.list = JSON.parse(uni.getStorageSync('myFavorite') || '[]')
			}catch(e){}
			uni.hideLoading()
			this.isOver = true;
		},
		methods:{
			goDetail(obj){
				wx.navigateTo({
					url: `/pages/detail/detail?desc=${obj.des}&intro=${obj.name}&_id=${obj._id}`
				});
			},
			clearData(){
				uni.removeStorage({
					key:'history',
					success:()=> {
						this.list = []
						uni.showToast({
							title:'清理成功'
						})
					}
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
	.list-item{
		display: block;
		padding: 40rpx;
		border-bottom:.5rpx solid #eaeaea;
		width: 100%;
		background: #FFFFFF;
		&:active{
			background-color: #eaeaea;
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
</style>
