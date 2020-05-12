<template>
	<view class="container">
		<uni-nav-bar :statusBar="true" :fixed="true" title="错误信息"  />
		<view class='items'>
			<view class='item' v-for="(item,index) in queryResult" :key="index">
				<view class='name'>{{item.inputValue}}</view>
				<view class='time'>{{item.addTime}}</view>
				<button class='insert' :id='item._id' :data-name="item.inputValue" v-if="item.isAdd==true">已增加</button>
				<button class='insert' type="primary" @tap='insert' :id='item._id' :data-name="item.inputValue" :data-formid="item.formId"
				 :data-openid="item._openid" v-else>增加</button>
				<button class='remove' type="warn" @tap='onRemove' :id='item._id' :data-name="item.inputValue" :data-formid="item.formId"
				 :data-openid="item._openid" >删除</button>
			</view>
		</view>

		<view class='mask' v-if="showInsert"></view>
		<view class='insertBox' v-if="showInsert">
			<view class='name'>{{obj.name}}</view>
			<view class='type'>
				<radio-group class="radio-group" @change="radioChange">
					<label class="radio" v-for="(item,index) in items" size="10" :key="index">
						<radio :value="item.value" :checked="item.checked" :data-name="item.name" />{{item.name}}
					</label>
				</radio-group>
			</view>
			<button class='add' @tap='onAdd'>增加</button>
			<view class='close' @tap='onClose'>
				<uni-icons type="closeempty"></uni-icons>
			</view>
		</view>
	</view>
</template>

<script>
	const app = getApp()

	export default {
		data() {
			return {
				obj: {
					name: '',
					des: 'household',
					type: '湿垃圾'
				},
				ckid: 0,
				formId: '',
				openid: '',
				showInsert: false,
				items: [{
						name: '湿垃圾',
						value: 'household',
						checked: 'true'
					},
					{
						name: '干垃圾',
						value: 'residual',
					},
					{
						name: '可回收物',
						value: 'recyclable'
					},
					{
						name: '有害垃圾',
						value: 'hazardous'
					},
				],
				queryResult: '',
			};
		},
		onLoad() {
			this.onQuery();
		},
		methods: {
			// 获取列表
			onQuery() {
				this.queryResult = [];
				const db = wx.cloud.database()
				// 查询当前用户所有的 counters
				db.collection('error-list').where({}).limit(999).get({
					success: res => {
						this.queryResult = res.data;
						console.log('[数据库] [查询记录] 成功: ', res.data)
					},
					fail: err => {
						wx.showToast({
							icon: 'none',
							title: '查询记录失败'
						})
						console.error('[数据库] [查询记录] 失败：', err)
					},
				})
			},
			// 新增
			insert(e) {
				this.obj.name = e.currentTarget.dataset.name;
				this.showInsert = true;
				this.ckid = e.currentTarget.id;
				this.formId = '';
				this.openid = e.currentTarget.dataset.openid;
			},
			// radiochange
			radioChange(e) {
				var name = "";
				if (e.detail.value == 'household') {
					name = "湿垃圾";
				} else if (e.detail.value == 'residual') {
					name = "干垃圾";
				} else if (e.detail.value == 'recyclable') {
					name = "可回收物";
				} else if (e.detail.value == 'hazardous') {
					name = "有害垃圾";
				}
				this.obj.des = e.detail.value;
				this.obj.type = name;
			},
			// 更新列表
			updateList() {
				wx.cloud.callFunction({
					name: "error_update",
					data: {
						database: "error-list",
						id: this.ckid,
						isAdd: true
					}
				}).then(res => {
					console.log(res);
					if (res.result.stats.updated == 1) {
						wx.showToast({
							title: '更新updateList成功',
							icon: 'none'
						});

						this.showInsert = false;
						this.onQuery();
					} else {
						wx.showToast({
							title: '你无权这样做',
							icon: 'none',
						})
					}
				}, err => {
					console.error('[数据库] [更新记录] 失败：', err)
				})
			},
			onAdd() {
				const db = wx.cloud.database()
				db.collection('all_rubbish').add({
					data: this.obj,
					success: res => {
						// 在返回结果中会包含新创建的记录的 _id

						wx.showToast({
							title: '新增记录成功',
						});
						this.notice();
						this.updateList();
					},
					fail: err => {
						wx.showToast({
							icon: 'none',
							title: '新增记录失败'
						})
						console.error('[数据库] [新增记录] 失败：', err)
					}
				})
			},
			onClose() {
				this.showInsert = false;
			},
			onRemove(e) {
				if (e.currentTarget.id) {
					uni.showModal({
						title: '提示',
						content: '确定删除吗？',
						success:res=> {
							if (res.confirm) {
								wx.cloud.callFunction({
									name: "error_delete",
									data: {
										database: "error-list",
										id: e.currentTarget.id,
									}
								}).then(res => {
									console.log(res);
									if (res.result.stats.removed == 1) {
										wx.showToast({
											title: '删除成功',
											icon: 'none'
										});
										this.onQuery();
									} else {
										wx.showToast({
											title: '你无权这样做',
											icon: 'none',
										})
									}

								}, err => {
									wx.showToast({
										icon: 'none',
										title: '删除失败',
									})
									console.error('[数据库] [删除记录] 失败：', err)
								}).catch(error => {})
							}
						}
					})
				} else {
					wx.showToast({
						title: '无记录可删，请见创建一个记录',
					})
				}
			},
			// 发送提醒
			notice() {
				wx.cloud.callFunction({
					name: 'openapi',
					data: {
						action: 'sendNoticeMessage',
						openid: this.openid,
						obj: this.obj
					},
					success: res => {
						console.warn('[云函数] [openapi] templateMessage.send 调用成功：', res)
						wx.showToast({
							title: '发送成功，请返回微信主界面查看',
						})
					},
					fail: err => {
						wx.showToast({
							icon: 'none',
							title: '调用失败',
						})
						console.error('[云函数] [openapi] templateMessage.send 调用失败：', err)
					}
				})
			},

		}
	}
</script>

<style lang="scss" scoped>
	.items {
		width: 100%;
		height: auto;
		padding: 15rpx;
		box-sizing: border-box;
		overflow: hidden;
	}

	.items .item {
		height: 60rpx;
		line-height: 60rpx;
		width: 100%;
		font-size: 24rpx;
		border-bottom: 1px solid #f1f1f1;
		overflow: hidden;
	}

	.items .item .name {
		float: left;
		width: 20%;
	}

	.items .item .time {
		width: 50%;
		float: left;
	}

	.items .item .insert {
		width: 20%;
		float: left;
		height: 40rpx;
		line-height: 40rpx;
		margin: 10rpx 0;
		padding: 0;
		border: 1px solid #f1f1f1;
		font-size: 24rpx;
	}

	.items .item .remove {
		width: 10%;
		float: left;
		height: 40rpx;
		line-height: 40rpx;
		margin: 10rpx 0;
		padding: 0;
		border: 1px solid #f1f1f1;
		font-size: 24rpx;
	}

	.mask {
		position: fixed;
		left: 0;
		top: 0;
		background: #000000;
		opacity: 0.7;
		width: 100%;
		height: 100%;

	}

	.insertBox {
		width: 80%;
		position: fixed;
		left: 0;
		right: 0;
		margin: 0 auto;
		top: 50%;
		transform: translateY(-50%);
		background: #ffffff;
		z-index: 2;
		border-radius: 5rpx;

	}

	.insertBox .name {
		height: 80rpx;
		line-height: 80rpx;
		text-align: center;
	}

	.insertBox .radio {
		width: 50%;
		float: left;
		padding: 10rpx;
		box-sizing: border-box;
	}

	.insertBox .type {
		font-size: 24rpx;
		padding: 20rpx;
	}

	.insertBox .add {

		background: #ec8902;
		color: #ffffff;
		text-align: center;
		height: 80rpx;
		line-height: 80rpx;
		margin: 0 auto;
		border-radius: 0;


	}

	.insertBox .close {
		width: 40rpx;
		height: 40rpx;
		line-height: 40rpx;
		text-align: center;
		position: absolute;
		right: 0;
		top: 0;
	}
</style>
