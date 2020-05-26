<template>
	<view class="container" v-show="auth.loginShow">
		<view class="bg-mask" @touchmove.stop.prevent @click.self="hiddenPop">
			<view class="bg-white loginPop" @click.stop>
				<view class="title flex ">请选择登录方式</view>
				<view class="items flex">
					<view class="item flex-sub">
						<button class="wechat" open-type="getUserInfo" @getuserinfo="getuserinfo"></button>
						<view>微信登录</view>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import {
		mapState
	} from 'vuex'
	export default {
		data() {
			return {

			};
		},
		computed: {
			...mapState(['auth'])
		},
		methods: {
			hiddenPop() {
				this.$store.commit("auth/hideLogin");
			},
			// 用户信息授权
			getuserinfo(e) {
				if (e.detail.userInfo) {
					this.$emit('onLogin', e.detail.userInfo)
				} else {
					uni.showToast({
						title:'需要授权才能获得完整权限',
						icon:'none'
					})
				}
			}
		}
	}
</script>

<style lang="scss" scoped>
	.loginPop {
		position: absolute;
		top: 50%;
		left: 50%;
		min-width: 550rpx;
		margin: auto;
		transform: translate(-50%, -50%);
		border-radius: 10rpx;

		.title {
			font-size: 30rpx;
			line-height: 80rpx;
			justify-content: center;
			border-bottom: 1rpx solid #E5E5E5;
		}

		.items {
			text-align: center;
			margin-top: 60rpx;
			padding-bottom: 60rpx;

			.item {
				width: 200rpx;
				font-size: 26rpx;

				button {
					&:after {
						border: none !important;
					}
				}

				.wechat {
					width: 88rpx;
					height: 88rpx;
					background: url('../../static/images/wechat.png') no-repeat center center;
					background-size: 100%;
					margin: 30rpx auto;
				}

			}
		}

		button {
			margin-bottom: 20rpx;
		}
	}
</style>
