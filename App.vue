<script>
	import {
		getSkuList,
		login
	} from '@/api/api.js';
	export default {
		onLaunch: function() {
			console.log('App Launch')
			// this.login()		
		},
		onShow: function() {
			console.log('App Show')
		},
		onHide: function() {
			console.log('App Hide')
		},
		methods: {
			login() {
				uni.login({
					success: res => {
						login({
							code: res.code
						}).then((data) => {
							if (data.status == '4001') {
								uni.showModal({
									title: '提示',
									content: '登录失败，请重试',
									showCancel: false,
								});
							} else if (data.status == '4002') {
								uni.showModal({
									title: '提示',
									content: '还没有账号呢，快去注册吧 ~',
									showCancel: false,
									success: res => {
										uni.navigateTo({
											url: '/pages/register/register',
										});
									},
								});
							}else if(data.token){
								let { token } = data;
                                  uni.setStorageSync('token', token);
							}
						}, (err) => {
							console.log("err");
							console.log(err);
						})
					},
				});
			},
		}
	}
</script>

<style>
	/*每个页面公共css */
	@import './common/common.scss';
</style>
