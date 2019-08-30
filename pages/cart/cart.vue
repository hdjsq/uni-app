<template>
	<view>
		<view v-if="cartNum">
			<view class="cart-title">
				<text>共{{cartNum}}件宝贝</text>
				<text class="manage" @click="manageProduct">{{management}}</text>
			</view>
			<view class="cart-list" v-for="item in cartList" :key="item.id">
				<checkbox value="cb" :checked="item.checked" @click="clickItemChecked(item)" color="#EE7C0C" />
				<image :src="item.skuImg" mode="aspectFit" class="honey-img"></image>
				<view class="info">
					<view class="info-title">{{item.prodTitle}}</view>
					<view class="info-g">{{item.specNm}}</view>
					<view class="info-bottom">
						<text class="price">¥{{item.unitPrice}}</text>
						<view class="inputNum">
							<view class="sub" @click="sub(item)">-</view>
							<input type="text" :value="item.qty" class="num" @input="changeqty(item)">
							<view class="add" @click="add(item)">+</view>
						</view>
					</view>
				</view>
			</view>
			<!-- 	<view class="cart-list">
				<checkbox value="cb" checked="true" color="#EE7C0C" />
				<image src="/static/test/4.png" mode="aspectFit" class="honey-img"></image>
				<view class="info">
					<view class="info-title">千年神树蜂蜜 原生态蜂蜜 天然野生蜂蜜千年神树蜂蜜 原生态蜂蜜 天然野生蜂蜜千年神树蜂蜜 原生态蜂蜜</view>
					<view class="info-g">500g</view>
					<view class="info-bottom">
						<text class="price">¥1680.00</text>
						<view class="inputNum">
							<view class="sub">-</view>
							<input type="text" value="1" class="num">
							<view class="add">+</view>
						</view>
					</view>
				</view>
			</view> -->
		</view>
		<view v-else class="empty">
			<view>
				购车是空的哦~
			</view>
			<view @click="goHome">
				快去逛逛
			</view>
		</view>
		<!-- 购物车下放合计 -->
		<view class="cart-bottom" v-if="cartList.length">
			<view class="allCheck">
				<checkbox value="cb" :checked="selectAll" color="#EE7C0C" @click="clickSelectAll" />
				<text>全选</text>
			</view>
			<view class="totalWrap">
				<view class="total" v-show="status == 1">
					<text>合计：</text>
					<text class="totalPrice">¥{{cartPrice}}</text>
				</view>
				<view class="settlement" v-show="status == 1" @click="settlement">结算{{cartSelectArr.length? '('+cartSelectArr.length+')' :''}}</view>
				<view class="settlement del" v-show="status == 2" @click="delCart">删除</view>
			</view>
		</view>
	</view>
</template>
<script>
	import {
		getCart,
		updCart,
		delCart
	} from '@/api/api.js'
	export default {
		data() {
			return {
				management: '管理商品', //状态对应文字展示
				status: "1", //1表示正常状态，2表示商品管理状态
				cartList: [], // 存放购物车列表   子项checked字段会改变
				cartNum: 0, // 等于 cartList.length
				cartPrice: 0, //勾选的总价格
				cartSelectArr: [], //存放购物车列表中checked为true的子项
				selectAll: true //全选状态
			}
		},
		watch: {
			//监听选中列表的长度  如果有变动  不等于cartList.length 则非全选  反之 true
			'cartSelectArr.length': {
				handler(newValue, oldValue) {
					if (newValue !== this.cartNum) {
						this.selectAll = false
						// 操作
					} else {
						this.selectAll = true
					}
				}
			}
		},
		onHide() {
			this.management = '管理商品';
			this.status = 1;
		},
		onShow() {
			//初始获取购物车列表
			this.getCartInfo();
		},
		methods: {
			//点击全选触发的事件  全选状态置成反  cartList子项 checked字段置成对应值，cartSelectArr存入已勾选数据  计算价格
			clickSelectAll() {
				this.selectAll = !this.selectAll
				let arr = [];
				this.cartList.map((child) => {
					child.checked = this.selectAll;
					if (child.checked) {
						arr.push(child);
					}
				})
				this.cartSelectArr = arr;
				this.getPrice();
			},
			//计算价格 cartSelectArr长度为1 取cartSelectArr【0】的unitPrice * qty 为0价格为0  大于1 计算cartSelectArr中子项unitPrice*qty 求和
			getPrice() {
				if (this.cartSelectArr.length == 1) {
					this.cartPrice = this.cartSelectArr[0].unitPrice * this.cartSelectArr[0].qty
					return
				} else if (this.cartSelectArr.length == 0) {
					this.cartPrice = 0;
					return
				}
				this.cartPrice = this.cartSelectArr.reduce(function(prev, next, index, array) {
					return prev.unitPrice * prev.qty + next.unitPrice * next.qty;
				})
			},
			//点击子项的选中按钮， 改变选中状态  cartSelectArr对应更新  计算价格 
			clickItemChecked(item) {
				item.checked = !item.checked;
				// console.log(item.checked)
				this.cartSelectArr = this.cartList.filter((child) => child.checked);
				this.getPrice();
				console.log(this.cartSelectArr)
			},
			//初始 获取购物车数据   子项增加checked字段 初始设置为true  cartSelectArr，cartPrice对应同步 
			getCartInfo() {
				getCart().then((res) => {
					console.log(res)
					let cartSelectArr = [];
					let cartPrice = 0;
					for (let i in res) {
						//初始勾选状态设置为true
						res[i].checked = true;
						cartSelectArr.push(res[i]);
						cartPrice += res[i].qty * res[i].unitPrice;
					}
					this.cartList = res;
					this.cartNum = res.length;
					this.cartSelectArr = cartSelectArr;
					this.cartPrice = cartPrice;
				})
			},
			//修改当前操作状态， 正常状态 status = 1 下单结算流程 management展示为 管理商品，购物车管理状态 status = 2 management展示为 取消选择，
			manageProduct() {
				//1表示正常状态，2表示商品管理状态
				if (this.management == '管理商品') {
					this.management = '取消选择';
					this.status = 2;
				} else if (this.management == '取消选择') {
					this.management = '管理商品';
					this.status = 1;
				}
			},
			//更改购车数量 减法
			sub(item) {
				if (item.qty > 0) {
					item.qty--;
					let data = {
						id: item.id,
						oprType: 1,
						qty: item.qty
					}
					this.getPrice();
					updCart(data).then((res) => {
						console.log(res)
					})
				}
			},
			//更改购车数量 input change事件
			changeqty(item) {
				if (item.qty > 99) {
					item.qty = 99
				} else if (item.qty < 1) {
					item.qty = 1
				}
				this.getPrice();
				let data = {
					id: item.id,
					oprType: 1,
					qty: item.qty
				}
				updCart(data).then((res) => {
					console.log(res)
				})
			},
			//更改购车数量 加法
			add(item) {
				if (item.qty < 98) {
					item.qty++;
					let data = {
						id: item.id,
						oprType: 1,
						qty: item.qty
					}
					this.getPrice();
					updCart(data).then((res) => {
						console.log(res)
					})
				}
			},
			//页面跳转到提交订单
			settlement() {
				let params = {
					orderList: this.cartSelectArr,
					cartPrice: this.cartPrice,
					source: 1 // 来源 1表示购物车下单  2表示直接下单
				}
				params = JSON.stringify(params);
				uni.navigateTo({
					url: '/pages/cart/confirm-order/confirm-order?params=' + params
				});
			},
			//去首页
			goHome() {
				uni.switchTab({
					url: '/pages/index/index',
				})
			},
			//购物车删除   cartSelectArr中id取出
			delCart() {
				uni.showModal({
					title: '提示',
					content: '确认将选中商品从购物车中删除？',
					showCancel: true,
					cancelText: '取消',
					confirmText: '确认',
					success: res => {
						let ids = this.cartSelectArr.map((child) => {
							child.id
						})
						delCart({
							ids
						}).then((res) => {
							console.log(res)
						})
					},
				});
			}
		},
	};
</script>

<style lang="scss">
	page {
		background-color: #f7f7f7;
		padding-bottom: 93upx;
	}

	checkbox .wx-checkbox-input {
		border-radius: 50%;
		width: 36upx;
		height: 36upx;
		color: #ffffff !important;
	}

	checkbox .wx-checkbox-input.wx-checkbox-input-checked {
		background: #EE7C0C;
	}

	.cart-title {
		width: 100%;
		height: 90upx;
		background: rgba(235, 235, 235, 0.7);
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 0 48upx;
		font-size: 28upx;
		color: #717171;
		letter-spacing: 0;
		box-sizing: border-box;

		.manage {
			color: #ee7c0c;
		}
	}

	.cart-list {
		width: 100%;
		overflow: hidden;
		background: #fff;
		height: 240upx;
		padding: 0 46upx 0 29upx;
		display: flex;
		align-items: center;
		margin-bottom: 14upx;

		.honey-img {
			width: 178upx;
			height: 178upx;
			margin-left: 16upx;
			border: 1upx solid rgb(151, 151, 151);
		}

		.info {
			width: 424upx;
			margin-left: 20upx;

			&-title {
				width: 100%;
				font-size: 24upx;
				color: #151515;
				letter-spacing: 0;
				line-height: 30upx;
				height: 60upx;
				overflow: hidden;
				text-overflow: ellipsis;
				/*设置成弹性盒子 */
				display: -webkit-box;
				/*显示的个数 */
				-webkit-line-clamp: 2;
				/* 属性规定框的子元素应该被水平或垂直排列。 */
				-webkit-box-orient: vertical;
			}

			&-g {
				width: 180upx;
				height: 48upx;
				line-height: 48upx;
				background: #EBEBEB;
				border-radius: 8upx;
				padding-left: 26upx;
				font-size: 24upx;
				color: #717171;
				letter-spacing: 0;
				margin-top: 12upx;
				box-sizing: border-box;
			}

			&-bottom {
				display: flex;
				justify-content: space-between;
				align-items: center;
				margin-top: 17upx;

				.price {
					font-size: 30upx;
					color: #EE7C0C;
					letter-spacing: 0;
				}

				.inputNum {
					display: flex;
					border: 1px solid #717171;
					border-radius: 10upx;
					font-size: 30upx;
					color: #717171;
					letter-spacing: 0;

					.sub {
						width: 50upx;
						height: 52upx;
						line-height: 52upx;
						border-right: 1px solid #717171;
						text-align: center;
					}

					.add {
						width: 50upx;
						height: 52upx;
						line-height: 52upx;
						border-left: 1px solid #717171;
						text-align: center;
					}

					input {
						width: 100upx;
						height: 48upx;
						display: block;
						text-align: center;
					}
				}
			}
		}
	}

	.cart-bottom {
		position: fixed;
		width: 100%;
		height: 93upx;
		background: #FFFFFF;
		left: 0;
		bottom: 0;
		overflow: hidden;
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding-left: 29upx;
		padding-right: 45upx;
		box-sizing: border-box;
		z-index: 10;

		.allCheck {
			font-size: 28upx;
			color: #717171;
			letter-spacing: 0;
			display: flex;
			align-items: center;
		}

		.totalWrap {
			display: flex;
			align-items: center;

			.total {
				font-size: 28upx;
				color: #717171;
				letter-spacing: 0;

				&Price {
					font-size: 30upx;
					color: #EE7C0C;
				}
			}

			.settlement {
				margin-left: 23upx;
				width: 200upx;
				height: 72upx;
				line-height: 72upx;
				text-align: center;
				background: #EE7C0C;
				border-radius: 100upx;
				font-size: 30upx;
				color: #FFFFFF;
				letter-spacing: 0;
				text-align: center;
			}

			.del {
				border: 1px solid #EE7C0C;
				background: #FFFFFF;
				color: #EE7C0C;
			}
		}

	}

	.empty {
		width: 100%;
		display: flex;
		flex-direction: column;
		align-items: center;

		view:first-child {
			margin-top: 200upx;
		}

		view:last-child {
			margin-top: 50upx;
			padding: 10upx 30upx;
			border: 1px dashed #717171;
		}
	}
</style>
