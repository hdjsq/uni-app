<template>
	<view class="box">
		<view class="avatar">
			<open-data type="userAvatarUrl"></open-data>
		</view>
		<open-data type="userNickName" class="nickName"></open-data>
		<!-- 微信端特有，跨端需要更改 -->
		<button class="onGotUserInfo" open-type="getUserInfo" lang="zh_CN" @getuserinfo="getuserinfo">点击获取用户信息完成注册</button>
	</view>
</template>

<script>
	import {
		register,
	} from '@/api/api.js'
	export default {
		mounted() {},
		methods: {
			getuserinfo(e) {
				console.log("点击授权按钮")
				console.log("开始注册")
				if (e.detail.iv) {
					// uni.showLoading({
					// 	title: '请稍后',
					// })
					let encryptedData = e.detail.encryptedData
					let iv = e.detail.iv
					uni.login({
						success: function(res) {
							let code = res.code;
							let iv = e.detail.iv;
							let encryptedData = e.detail.encryptedData;
							// 下面开始调用注册接口
							// console.log("iv=" + iv)
							// console.log("code=" + code)
							// console.log("encryptedData=" + encryptedData)
							let data = {
								code,
								iv,
								encryptedData
							}
							register(data).then((res) => {
								uni.showModal({
									title: '提示',
									content: '注册成功，快去购物吧~',
									showCancel: false,
									success: res => {
										let pageUrl = uni.getStorageSync("pageUrl")
										uni.switchTab({
											url: "/" + pageUrl,
											fail:(res)=>{
												uni.switchTab({
													url: "pages/index/index",
												})
											}
										})
									},
								});
								console.log(res)
							})
						}
					})
				} else {
					uni.showModal({
						title: '提示',
						content: '获取权限失败，请重试',
						showCancel: false,
						// cancelText: '确认',
						// confirmText: '取消',
					});
					console.log("拒绝授权")
				}
			},
		}
	}
</script>

<style scoped>
	.box {
		display: flex;
		justify-content: center;
		align-items: center;
		flex-direction: column;
		padding-top: 200upx;
		width: 100%;
		height: 100%;
	}

	.avatar {
		display: block;
		width: 200upx;
		height: 200upx;
		border-radius: 50%;
		overflow: hidden;
	}

	.nickName {
		text-align: center;
		margin-top: 20rpx;
	}

	.onGotUserInfo {
		margin-top: 20upx;
		font-size: 34upx;
	}
</style>
