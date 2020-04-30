<script>
export default {
	onLaunch: function() {
		console.log('App Launch');
		if (!wx.cloud) {
		  console.error('请使用 2.2.3 或以上的基础库以使用云能力')
		} else {
		  wx.cloud.init({
			traceUser: true,
		  })
		}
		wx.getSystemInfo({
		  success: (res) => {
			//console.log(res);
			this.globalData.model2 = res.model;
			this.globalData.dev = res.system;
			this.globalData.windowHeight = res.windowHeight;
			this.globalData.screenHeight = res.screenHeight;
			this.globalData.statusBarHeight = res.statusBarHeight * 2;
			this.globalData.windowWidth = res.windowWidth;
			this.globalData.screenWidth = res.screenWidth;
			if (res.system.indexOf("Android") != -1) {
			  //console.log('安卓');
			  this.globalData.device = 2;
			}
			if (res.system.indexOf("iOS") != -1) {
			  //console.log('IOS');
			  this.globalData.device = 1;
			}
			if (res.model.indexOf("iPhone X") != -1) {
			  this.globalData.model = 1;
			}
			if (res.model.indexOf("iPad") != -1) {
			  this.globalData.model = 3;
			}
		  }
		});
	},
	onShow: function() {
		console.log('App Show');
	},
	onHide: function() {
		console.log('App Hide');
	},
	globalData: {
		device: 0, //操作系统 0 默认 1 iso 2 Android
		model: 0,
		statusBarHeight: 0,
		model2: '',//手机名称
		dev: '',//手机操作系统
		windowHeight: '',
		windowWidth: '',
		screenHeight: '',
		screenWidth: '',
	}
};
</script>

<style>
/*每个页面公共css */
@import './styles/base.css';
/* 解决头条小程序组件内引入字体不生效的问题 */
/* #ifdef MP-TOUTIAO */
@font-face {
	font-family: uniicons;
	src: url('/static/uni.ttf');
}
/* #endif */
.container {
  display: flex;
  flex-direction: column;
  align-items: center;
  box-sizing: border-box;
} 

</style>
