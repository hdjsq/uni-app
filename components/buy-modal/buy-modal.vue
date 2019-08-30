<template>
	<view class="main" @touchmove.stop="banScroll" v-show="show" :animation="animationData">
		<view class="bg"></view>
		<view class="buy-modal">
			<view class="close" @click.stop="close">
				<i class="iconfont">&#xe606;</i>
			</view>
			<view class="top">
				<view class="left">
					<image :src="selectItem.mainImage" mode=""></image>
				</view>
				<view class="right">
					<view class="price">
						<text class="new">¥{{selectItem.discountPrice * qty}}</text>
						<text class="old">¥{{selectItem.originalPrice * qty}}</text>
					</view>
					<view class="stock">库存{{selectItem.stock}}件</view>
					<view class="specification">
						<text>规格：{{selectItem.specNm}}</text>
						<text>x {{qty}}</text>
					</view>
				</view>
			</view>
			<view class="bottom">
				<view class="num">
					<view>数量</view>
					<view class="counter">
						<view @click="sub">-</view>
						<input type="text" v-model="qty" @input="changeQty" />
						<view @click="add">+</view>
					</view>
				</view>
				<view class="specification">
					<view>规格</view>
					<view class="specification-box">
						<view :class="selectItem.id == item.id ? 'active' : ''" @click="clickSku(index)" v-for="(item,index) in skuList">{{item.specNm}}</view>
					</view>
				</view>
				<view class="btn">
					<view class="left" @click="addToCart">确认加入</view>
					<view class="right" @click="goBuy">立即购买</view>
				</view>
			</view>
		</view>
	</view>

</template>

<script>
	import {
		addCart
	} from '@/api/api.js';
	export default {
		props: {
			show: {
				type: Boolean
			},
			skuList: {
				type: Array
			},
			prodTitle:{
				type:String
			}
		},
		data() {
			return {
				qty: 1,
				selectIndex: 0
			}
		},
		computed: {
			selectItem() {
				return this.skuList[this.selectIndex]
			}
		},
		methods: {
			add() {
				let qty = this.qty;
				if (qty < 98) {
					this.qty++
				}
			},
			sub() {
				let qty = this.qty;
				if (qty > 1) {
					this.qty--
				}
			},
			changeQty(e) {
				let qty = this.qty;
				if (qty < 1) {
					this.qty = 1;
				}
				if (qty > 98) {
					this.qty = 99;
				}
			},
			clickSku(index) {
				this.selectIndex = index;
			},
			//打开弹窗时禁止滚动
			banScroll() {
				return false
			},
			//关闭弹窗
			close() {
				this.$emit('closeModal')
			},
			//加购
			addToCart() {
				let data = {
					qty:this.qty,
					skuid:this.selectItem.skuid,
				}
				addCart(data).then((res)=>{
					uni.showToast({
						title: '已加入购物车'
					});
				})
			},
			//下单
			goBuy() {
				let {
					id,
					pid,
					mainImage,
					skuid,
					specNm,
					discountPrice
				} = this.selectItem;
				let obj = {
					id,
					pid,
					prodTitle:this.prodTitle,
					skuImg:mainImage,
					skuid,
					specNm,
					unitPrice:discountPrice,
					qty:Number(this.qty)
				}
				console.log(obj);
				let params = {
					orderList: [obj],
					cartPrice: Number(discountPrice) * Number(this.qty),
					source:2  // 来源 1表示购物车下单  2表示直接下单
				}
				// console.log(params)
				// return
				params = JSON.stringify(params);
				uni.navigateTo({
					url: '/pages/cart/confirm-order/confirm-order?params=' + params
				});
			}
		},
	}
</script>

<style lang="scss" scoped>
	.bg {
		position: fixed;
		left: 0;
		top: 0;
		right: 0;
		bottom: 0;
		background: rgba(0, 0, 0, 0.50);
		z-index: 10;
	}

	.buy-modal {
		position: fixed;
		bottom: 0;
		width: 100%;
		height: 770upx;
		background: #F5F5F5;
		border-top-left-radius: 20upx;
		border-top-right-radius: 20upx;
		z-index: 10;

		.close {
			position: absolute;
			top: 32upx;
			right: 32upx;
		}

		.top {
			background: #fff;
			border-top-left-radius: 20upx;
			border-top-right-radius: 20upx;
			display: flex;
			height: 277upx;
			padding: 53upx 50upx;
			width: 100%;

			.left {
				image {
					width: 178upx;
					height: 178upx;
					border: 1px solid #a1a1a1;
				}
			}

			.right {
				flex: 1;
				margin-left: 40upx;

				.price {
					.new {
						font-family: PingFangSC-Medium;
						font-size: 40upx;
						color: #EE7C0C;
					}

					.old {
						font-size: 28upx;
						color: #717171;
						margin-left: 16rpx;
						text-decoration: line-through;
					}
				}

				.stock {
					font-size: 24upx;
					color: #ACACAC;
					margin-top: 10upx;
					margin-left: 12upx;
				}

				.specification {
					margin-top: 50upx;
					display: flex;
					justify-content: space-between;
					margin-left: 12upx;
				}
			}
		}

		.bottom {
			padding: 48upx;
			background: #fff;
			margin-top: 12upx;
			height: 100%;

			.num,
			.specification {
				&>view:first-child {
					margin-bottom: 16upx;
				}
			}

			.num {
				.counter {
					display: flex;

					view {
						width: 80upx;
						height: 60upx;
						text-align: center;
						line-height: 60upx;
						background: #EBEBEB;
					}

					input {
						width: 140upx;
						height: 60upx;
						margin: 0 10upx;
						text-align: center;
						background: #EBEBEB;
					}
				}
			}

			.specification {
				margin-top: 40upx;

				&-box {
					display: flex;

					view {
						width: 152upx;
						height: 60upx;
						background: #EBEBEB;
						border-radius: 8upx;
						text-align: center;
						line-height: 60upx;
						margin-right: 20upx;

						&.active {
							background: rgba(255, 169, 66, 0.40);
							position: relative;
							overflow: hidden;
						}

						&.active::after {
							width: 40upx;
							height: 40upx;
							content: "";
							display: block;
							position: absolute;
							right: 0;
							bottom: 0;
							background: #FFA942;
							transform: translate(20upx, 20upx) rotate(45deg);
						}
					}
				}
			}

			.btn {
				width: 520upx;
				height: 72upx;
				margin: 0 auto;
				border-radius: 36upx;
				color: #fff;
				display: flex;
				margin-top: 53upx;

				view {
					text-align: center;
					line-height: 72upx;
					flex: 1;
				}

				.left {
					background: #F8C018;
					border-top-left-radius: 36upx;
					border-bottom-left-radius: 36upx;
				}

				.right {
					background: #EE7C0C;
					border-top-right-radius: 36upx;
					border-bottom-right-radius: 36upx;
				}
			}
		}

	}
</style>
