import url from './config.js';
const baseUrl = url.baseUrl
// 封装post请求
const postData = (url, data = {}) => {
	uni.showLoading({
		title: '加载中',
		mask: false
	});
	let _url = url;
	let _data = data;
	url = baseUrl + url;
	let token = uni.getStorageSync('token');
	if (token) {
		data.token = token;
	}
	var promise = new Promise((resolve, reject) => {
		//网络请求
		uni.request({
			url: url,
			data: data,
			method: 'POST',
			header: {
				'content-type': 'application/json',
				// 'content-type': 'application/x-www-form-urlencoded',
			},
			success: function(res) { //服务器返回数据
				if(res.data.status == "4003"){
					console.log("没登录")
					return login().then((res)=>{
						getData(_url,_data).then((child)=>{
							resolve(child);
						})
					})
				}
				if (res.statusCode == 200) {
					resolve(res.data.data);
				} else {
					uni.showModal({
						title: '提示',
						content: '出错了',
						showCancel: false,
					});
					reject("出错了");
				}
			},
			fail: function(e) {
				uni.showModal({
					title: '提示',
					content: '网络错误，请稍后再试',
					showCancel: false,
				});
				reject('网络出错');
			},
			complete: () => {
				uni.hideLoading();
			}
		})
	});
	return promise;
}
// 封装get请求
const getData = (url, data = {}) => {
	uni.showLoading({
		title: '加载中',
		mask: false
	});
	let _url = url;
	let _data = data;
	url = baseUrl + url;
	let token = uni.getStorageSync('token');
	if (token) {
		data.token = token;
	}
	var promise = new Promise((resolve, reject) => {
		//网络请求
		uni.request({
			url: url,
			data: data,
			header: {
				'content-type': 'application/json',
				// 'token': uni.getStorageSync('token')
			},
			success: function(res) { //服务器返回数据
				if (res.statusCode == 200) {
					if(res.data.status == "4003"){
						return login().then((res)=>{
							getData(_url,_data).then((child)=>{
								resolve(child);
							})
						})
					}
					resolve(res.data.data);
				} else {
					uni.showModal({
						title: '提示',
						content: '出错了',
						showCancel: false,
					});
					reject("出错了");
				}
			},
			fail: function(e) {
				uni.showModal({
					title: '提示',
					content: '网络错误，请稍后再试',
					showCancel: false,
				});
				reject('网络出错');
			},complete:()=>{
				uni.hideLoading();
			}
		})
	});
	return promise;
}

function login() {
	uni.showLoading({
		title: '请稍后',
		mask: false
	});
	// 微信登录
	return new Promise((resolve, reject) => {
		uni.login({
			success: function(res) {
				// console.log("res.code = " + res.code);
				uni.request({
					url: baseUrl + '/user/userlogin/login',
					data: {
						code: res.code
					},
					success: function(res) {
						console.log('login')
						console.log(res)
						uni.hideLoading();
						// console.log('res.status = ' + res.data.status);
						if (res.data.status === '4001') {
							uni.showModal({
								title: '提示',
								content: '无法登录，请重试',
								showCancel: false
							})
						}
						if (res.data.status === "200") {
							uni.setStorageSync('token', res.data.data.token);
							resolve()
						}
						if (res.data.status === '4002') {
							console.log("未注册--准备跳转注册页面")
							uni.removeStorageSync('pageUrl')
							// 账号未注册,记录落地页路径
							var pages = getCurrentPages() //获取加载的页面
							// console.log(pages)
							var currentPage = pages[pages.length - 1] //获取当前页面的对象
							var url = currentPage.route //当前页面url
							var options = currentPage.options
							let params = '?'
							for (let i in options) {
								params += `${i}=${options[i]}&`
							}
							params = params.substring(0, params.length - 1)
							url += params
							uni.setStorageSync("pageUrl", url)
							//弹窗跳转注册页
							uni.showModal({
								showCancel: false,
								title: '提示',
								content: '完成注册即可以体验完整功能，快去注册吧！',
								complete: () => {
									wx.redirectTo({
										url: '/pages/register/register',
									})
								}
							})
						}
					},
					fail: function(res) {
						fail: (err) => {
							wx.hideLoading()
							wx.showModal({
								title: '网络错误',
								content: '请检查网络'
							})
						},
						// console.log('wx.login faile,res=' + res.errMsg)
						reject()
					}
				})
			}
		})
	})
}
module.exports = {
	postData,
	getData,
}
