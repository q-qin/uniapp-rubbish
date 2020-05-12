<template>
	<view class="page">
		<web-view :src="src"></web-view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				src:'',
			};
		},
		onLoad(options) {
			if(options.src){
				this.src = options.src;
			}else{
				uni.showToast({
					icon:'none',
					title:'抱歉，系统异常~'
				})
				setTimeout(()=>{
					uni.navigateBack({
						delta:1
					})
				},1000)
			}
		}
	}
</script>

<style lang="scss">

</style>
