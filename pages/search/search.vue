<template>
	<view class="search-wrapper">
		<uni-nav-bar :statusBar="true" :fixed="true" left-icon="back" :homeIcon="homeIcon" title="垃圾分类查询" @clickLeft="clickLeft" />
		<view class="search">
			<form :report-submit='true'>
				<image src="../../static/images/search.png"></image>
				<input focus @input="bindKeyInput" :value="inputValue" placeholder="输入您要搜索的生活垃圾" placeholder-class='plocedHode'></input>
				<button  @tap="getList">搜索</button>
			</form>
		</view>
		<block v-if="myList.length>0 && showHistory">
			<view class='historyName'>我的搜索记录
			</view>
			<view class='myList'>
				<view class='item' v-for="(item,index) in myList" :key="index" @tap="setInput" :data-intro="item">{{item}} </view>
				<view class='item' @tap='deleteHistory'>
					<image src='../../static/images/alter_delete.png'></image>清空
				</view>
			</view>
		</block>

		<view class="history" v-if="showHistory">
			<view class="title"> 热门搜索</view>
			<text @tap="setInput" class="unit" :data-desc="item.des" :data-intro="item.inputValue" :data-title="item" v-for="(item,index) in historyList"
			 :key="index">{{item.inputValue}}</text>
		</view>
		<view class="box">
			<view @tap="goDetail" class="item" :data-desc="item.des" :data-intro="item.name" v-for="(item,index) in list" :key="index">
				<view class="item-inner">
					<view>{{item.name}}</view>
					<text>{{item.type}}</text>
				</view>
				<i class="wx-icon-custom-gengduo"></i>
			</view>
			<view class="bottom" style="text-align:center;font-size:28rpx;padding: 10rpx;" v-if="isOver">
				<text style="color:#666;">😅 抱歉，未查询到结果，我们将尽快完善</text>
				<view class="suggest">
					<span class="wx-icon-custom-tishi"></span> 建议：尽量输入较少的字。
					<view style="line-height: 3;color:#444;">例如：</view>
					<view>如果您想搜“屠龙宝刀”，建议输入“屠龙刀”</view>
					<view>如果您想搜“可乐瓶子”，建议输入“可乐瓶”</view>
					<view>如果您想搜“药片”，建议输入“药”</view>
					<view>如果您想搜“小李飞刀”，建议输入“飞刀”</view>
					<view>如果您想搜“大白菜叶子”，建议输入“白菜叶”</view>
					<view>如果您想搜“烂苹果”，建议输入“苹果”</view>
				</view>
				<view class="suggest">
					<span class="wx-icon-custom-tishi"></span> 你知道吗？下面都不属于生活垃圾
					<view>牛粪、鸟粪等</view>
					<view>狗屎、猫屎等动物粪便</view>
					<view>动物、宠物尸体</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				ckid: '',
				count: 0,
				inputValue: "",
				list: [],
				page: 1,
				num: 20,
				isOver: false,
				showHistory: true,
				historyList: [],
				myList: [],
				homeIcon:false,
			};
		},
		onLoad(options) {
			if (wx.getStorageSync('myList')) {
				var storageList = JSON.parse(wx.getStorageSync('myList'));
				this.myList = storageList
			}
			this.getHotList();
			if (options.back){
				this.homeIcon = true;
			}
			if (options.name) {
				this.inputValue = decodeURIComponent(options.name);
				var condition = {
					name: {
						$regex: ".*" + decodeURIComponent(options.name),
						$options: "i"
					}
				};
				var page = this.page,
					num = this.num;
				wx.cloud.callFunction({
					name: "collection_get",
					data: {
						database: "all_rubbish",
						page: page,
						num: num,
						condition: condition
					}
				}).then((res) => {
					if (res.result.data.length) {
						var list = res.result.data;
						this.list = list;
						uni.hideLoading();
						this.showHistory = false;
					}
				}).catch(console.error);
			}
		},
		onShareAppMessage() {
			return {
				title: "日常生活垃圾怎么分类？快来查一查",
				path: "pages/index/index"
			};
		},
		methods: {
			clickLeft() {
				uni.navigateBack({
					delta: 1
				})
			},
			// 获取热门搜索
			getHotList() {
				const db = wx.cloud.database()
				// 查询当前用户所有的 counters
				db.collection('search-list').orderBy('count', 'desc').get({
					success: res => {
						this.historyList = res.data;
						console.log('[数据库] [查询记录] 成功: ', res.data)
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
			// 查询
			getList(e) {
				var value = this.inputValue,
					db = (this.searchType, wx.cloud.database());

				if (value) {
					this.showHistory = false;
					if (this.myList.indexOf(value) == -1) {
						this.myList.push(value);
						this.myList = this.myList;
						wx.setStorage({
							key: 'myList',
							data: JSON.stringify(this.myList)
						});
					}
				}
				if (value) {
					var condition = {
						name: {
							$regex: ".*" + value.trim(),
							$options: "i"
						}
					};
					if (!this.isOver) {
						var page = this.page,
							num = this.num;
						uni.showLoading({
							title: '加载中'
						});
						wx.cloud.callFunction({
							name: "collection_get",
							data: {
								database: "all_rubbish",
								page: page,
								num: num,
								condition: condition
							}
						}).then((res) => {
							if (res.result.data.length) {
								var list = res.result.data;
								this.list = list;
								uni.hideLoading();
							} else {
								uni.hideLoading();
								this.isOver = true;
								// 无数据-增加订阅消息
								uni.showModal({
									content:`${value}还未录入,是否接受提醒?`,
									success(res) {
										if (res.confirm) {
											wx.requestSubscribeMessage({
												tmplIds: ['gYp1N9tLx7dICbcJrsuyR_Av-7VFsBJ20NYb3zB2Zn0'], // 此处可填写多个模板 ID，但低版本微信不兼容只能授权一个
												success(res) {
													console.log(res)
												},
												fail(error){
													console.error(error)
												}
											})
										}
									}
								})
								db.collection('search-list').where({
									inputValue: value.trim()
								}).get({
									success: res => {
										if (res.data.length == 0) {
											console.log('[search-list] [查询记录]为0 则增加: ');
											db.collection("search-list").add({
												data: {
													formId: e.detail.formId,
													description: "searchData",
													addTime: this.timestampToTime(Date.parse(new Date())),
													inputValue: value,
													isAdd: false,
													count: 1
												}
											}).then(function(res) {
												console.log("添加成功，", res);
											}).catch(console.error);
										} else {
											console.log('[search-list] [查询记录]不为0 则更新count: ');
											wx.cloud.callFunction({
												name: "search_update",
												data: {
													database: "search-list",
													id: res.data[0]._id,
													count: res.data[0].count + 1
												}
											}).then(res => {
												console.log(res);
												if (res.result.stats.updated == 1) {
													console.log('增加记录+1')
												} else {
													console.log('无权增加记录')
												}
											}, err => {
												console.error('[数据库] [更新记录] 失败：', err)
											})

										}

									},
									fail: err => {
										console.error('[数据库] [查询记录] 失败：')
									}
								})

								db.collection('error-list').where({
									inputValue: value.trim()
								}).get({
									success: res => {
										if (res.data.length == 0) {
											console.log('[error-list] [查询记录]为0 则增加: ');
											db.collection("error-list").add({
												data: {
													formId: e.detail.formId,
													description: "searchNone",
													addTime: this.timestampToTime(Date.parse(new Date())),
													inputValue: value,
													isAdd: false,
												}
											}).then(function(res) {
												console.log("添加错误成功，", res);
											}).catch(console.error);
										}
									},
									fail: err => {
										console.error('[数据库] [查询记录] 失败：')
									}
								})
							}
						}).catch(console.error);
					}
				}
			},
			timestampToTime(e) {
				var t = !(arguments.length > 1 && void 0 !== arguments[1]) || arguments[1],
					a = new Date(e * (t ? 1 : 1e3));
				return a.getFullYear() + "-" + (a.getMonth() + 1 < 10 ? "0" + (a.getMonth() + 1) : a.getMonth() + 1) + "-" + a.getDate() +
					" " + a.getHours() + ":" + a.getMinutes() + ":" + a.getSeconds();
			},
			bindKeyInput(e) {
				this.inputValue = e.detail.value;
				this.isOver = false;
				this.list = [];
				if (e.detail.value == '') {
					this.showHistory = true;
				}
			},
			setInput(e) {
				this.inputValue = e.currentTarget.dataset.intro;
			},
			deleteHistory() {
				this.myList = [];
				wx.removeStorage({
					key: 'myList'
				});
			},
			// 打开详情
			goDetail(e) {
				//先查询有没有记录
				const db = wx.cloud.database()
				db.collection('search-list').where({
					inputValue: e.currentTarget.dataset.intro
				}).get({
					success: res => {
						if (res.data.length > 0) {
							this.count = res.data["0"].count;
							this.ckid = res.data["0"]._id;

							wx.cloud.callFunction({
								name: "search_update",
								data: {
									database: "search-list",
									id: this.ckid,
									count: res.data["0"].count + 1
								}
							}).then(res => {
								console.log(res);
								if (res.result.stats.updated == 1) {
									console.log('增加记录+1')
								} else {
									console.log('无权增加记录')
								}
							}, err => {
								console.error('[数据库] [更新记录] 失败：', err)
							})
						}
						console.log('[数据库] [查询记录] 成功: ')
					},
					fail: err => {
						wx.showToast({
							icon: 'none',
							title: '查询记录失败'
						})
						console.error('[数据库] [查询记录] 失败：')
					}
				})
				var t = e.currentTarget.dataset.desc,
					a = e.currentTarget.dataset.intro;
				wx.navigateTo({
					url: "/pages/detail/detail?desc=" + t + "&intro=" + a
				});
			}
		}
	}
</script>

<style lang="scss" scoped>
	.search-wrapper {
		padding: 0;
		min-height: 100vh;
		background: #fff;
	}

	.search {
		margin: 20rpx 30rpx auto;
		height: 80rpx;
		line-height: 80rpx;
		width: 690rpx;
		position: relative;
	}

	.search form {
		width: 100%;
		height: 100%;
		padding: 0 0 0 20rpx;
		box-sizing: border-box;
		border-radius: 50rpx;
		background: #ececec;
		align-items: center;
		font-size: 28rpx;
		border: 1px solid #f1f1f1;
		display: block;
	}

	.search image {
		height: 36rpx;
		width: 36rpx;
		margin-right: 10rpx;
		float: left;
		margin-top: 22rpx;
	}

	input {
		border: none;
		float: left;
		height: 100%;
		width: 520rpx;
		color: #666;
		font-size: 26rpx;
	}

	.plocedHode {
		color: #999;
		font-size: 26rpx;
	}

	.search button {
		height: 78rpx;
		line-height: 76rpx;
		background: #00add8;
		color: #fff;
		border-radius: 0 38rpx 38rpx 0rpx;
		margin: 0;
		float: right;
		padding: 0 20rpx;
		font-size: 26rpx;
	}

	.search button::after {
		width: 0;
		height: 0;
	}

	.box {
		padding: 30rpx 0;
	}

	.box .item {
		display: flex;
		align-items: center;
		justify-content: space-between;
		position: relative;
		background: #fff;
		height: 150rpx;
		box-sizing: border-box;
		margin-bottom: 20rpx;
	}

	.box .item-inner {
		width: 80%;
		height: 130rpx;
		font-size: 28rpx;
		color: #555;
		display: flex;
		flex-direction: column;
		justify-content: space-around;
	}

	.box .item-inner view {
		background: #fff;
		font-size: 30rpx;
		color: #333;
		padding-left: 20rpx;
		line-height: 1.7;
	}

	.box .item-inner text {
		width: 100%;
		overflow: hidden;
		white-space: nowrap;
		text-overflow: ellipsis;
		padding-left: 20rpx;
	}

	.detail {
		position: fixed;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		background: rgba(0, 0, 0, 0.4);
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.detail .inner {
		border: 1px solid #07c160;
		border-radius: 40rpx;
	}

	.detail .top {
		padding: 10rpx 0;
		display: flex;
		flex-direction: column;
		align-items: center;
	}

	.detail .top image {
		height: 160rpx;
		width: 160rpx;
	}

	.detail .top view {
		padding: 20rpx 20rpx 0 20rpx;
		color: #555;
		font-size: 28rpx;
	}

	.spacer {
		height: 20rpx;
		background: #f6f6f6;
	}

	.history {
		padding: 16rpx;
		font-size: 30rpx;
		color: #555;
		position: relative;
		background: #fff;
	}

	.history .title {
		display: block;
		color: #333;
		font-size: 32rpx;
		padding: 20rpx 0;
		font-weight: bold;
	}

	.history .unit {
		border: 1px solid #f1f1f1;
		height: 55rpx;
		line-height: 55rpx;
		display: inline-block;
		padding: 0rpx 18rpx;
		border-radius: 27.5rpx;
		margin: 20rpx 15rpx;
	}

	.suggest {
		font-size: 30rpx;
		line-height: 1.8;
		margin-top: 20rpx;
		padding: 20rpx 20rpx;
		color: #f34343;
		text-align: left;
		background: #fff;
		border-radius: 20rpx;
	}

	.suggest view {
		font-size: 28rpx;
		line-height: 1.7;
		color: #555;
		text-align: left;
		text-indent: 20rpx;
	}

	.tucao {
		height: 56rpx;
		padding: 20rpx 20rpx 0 0;
		display: flex;
		justify-content: flex-end;
	}

	.tucao button {
		height: 50rpx;
		width: 180rpx;
		color: #666;
		background: #fff;
		border: 1px solid #ddd;
		line-height: 46rpx;
		font-size: 28rpx;
		border-radius: 40rpx;
		padding: 0;
		margin: 0;
	}

	.tucao button::after {
		border: none;
	}

	.historyName {
		padding: 20rpx;
		font-size: 32rpx;
		color: #333;
		height: 60rpx;
		line-height: 60rpx;
		background: #fff;
	}

	.myList {
		padding: 20rpx;
		background: #fff;
		margin-bottom: 20rpx;
		overflow: hidden;
	}

	.myList .item {
		height: 55rpx;
		line-height: 55rpx;
		color: #666;
		font-size: 24rpx;
		border: 1rpx solid #ececec;
		float: left;
		padding: 0 20rpx;
		margin: 5rpx;
		border-radius: 55rpx;
	}

	.myList image {
		width: 34rpx;
		height: 34rpx;
		margin-top: 13rpx;
		float: left;
		margin-right: 10rpx;
	}
</style>
