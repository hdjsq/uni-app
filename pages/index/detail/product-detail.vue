<template>
	<view>
		<view>
			<swiper class="swiper" :indicator-dots="true" :autoplay="true" :interval="3000" :duration="1000" :circular="true">
				<swiper-item>
					<image src="/static/test/98g.jpg" mode=""></image>
				</swiper-item>
				<swiper-item>
					<image src="/static/test/250g.jpg" mode=""></image>
				</swiper-item>
				<swiper-item>
					<image src="/static/test/500g.jpg" mode=""></image>
				</swiper-item>
			</swiper>
		</view>
		<view class="desc">
			<view class="price">
				<text class="new">￥{{discoutPrice}}</text>
				<text class="old">￥{{originalPrice}}</text>
				<!-- <text class="share"></text> -->
			</view>
			<view class="title">
				{{prodTitle}}
			</view>
			<!-- <view class="orderNum bb">0人已付款</view> -->
			<view class="bb item">
				<text>发货</text>
				<view>快递：包邮</view>
			</view>
			<view class="bb item" @click="clickBuy">
				<text>规格</text>
				<view class="rightArr">
					<view class="">
						请选择规格
					</view>
					<view class="sp">
						{{skuList[0].specNm}}
					</view>
				</view>
			</view>
			<view class="bb item" @click="openParamsModal">
				<text>参数</text>
				<view class="rightArr">品牌系列、是否进口</view>
			</view>
		</view>
		<view class="detail">
			<view class="title">
				宝贝详情
			</view>
			<scroll-view scroll-y>
				<image v-for="item in detailImg" :src="item" mode="widthFix" lazy-load="true"></image>
			</scroll-view>
		</view>
		<BuyModal :show="showBuyModal" @closeModal="closeBuy" :skuList="skuList" :prodTitle="prodTitle"></BuyModal>
		<ParamsModal :show="showParamsModal" @closeParamsModal="closeParamsModal"></ParamsModal>

		<view class="bottom-buy">
			<view class="item" @click="goHome">
				<image src="/static/icon/home-select.png" mode=""></image>
				<view>
					首页
				</view>
			</view>
			<view class="item" @click="goCart">
				<image src="/static/icon/cart.png" mode=""></image>
				<view>
					购物车
				</view>
			</view>
			<view class="buyBtn">
				<view @click="clickBuy">加入购物车</view>
				<view @click="clickBuy">立即购买</view>
			</view>
		</view>
	</view>
</template>

<script>
	import BuyModal from '@/components/buy-modal/buy-modal.vue';
	import ParamsModal from '@/components/params-modal/params-modal.vue';
	import url from '@/api/config.js';
	const ossUrl = url.ossUrl
	import {
		getProdDetail
	} from '@/api/api.js';
	export default {
		components: {
			BuyModal,
			ParamsModal
		},
		data() {
			return {
				showBuyModal: false,
				showParamsModal: false,
				pid: '',
				minDiscountPrice: 0,
				maxDiscountPrice: 0,
				minOriginalPrice: 0,
				maxOriginalPrice: 0,
				mainImage: '',
				otherImages: [],
				prodTitle: '',
				skuList: [],
				detailImg: []
			}
		},
		mounted(){
			for(let i = 1;i < 9;i++){
				this.detailImg.push(`${ossUrl}/home/detail/detail/detail_0${i}.jpg`)
			}
		},
		onLoad(option) {
			//获取上个页面传来的商品pid 调用详情接口
			let {
				pid
			} = option;
			this.pid = pid;
			getProdDetail({
				pid
			}).then((res) => {
				console.log(res)
				this.minDiscountPrice = res.prodVo.minDiscountPrice;
				this.maxDiscountPrice = res.prodVo.maxDiscountPrice;
				this.minOriginalPrice = res.prodVo.minOriginalPrice;
				this.maxOriginalPrice = res.prodVo.maxOriginalPrice;
				this.mainImage = res.prodVo.mainImage;
				this.otherImages = res.prodVo.otherImages;
				this.prodTitle = res.prodVo.prodTitle;
				this.skuList = res.skuVoList;
			})
		},
		computed: {
			//计算原价和折扣价的范围
			discoutPrice() {
				return `${this.minDiscountPrice}-${this.maxDiscountPrice}`
			},
			originalPrice() {
				return `${this.minOriginalPrice}-${this.maxOriginalPrice}`
			},
		},
		methods: {
			//去购物车
			goCart() {
				uni.switchTab({
					url: '/pages/cart/cart'
				});
			},
			//去首页
			goHome() {
				uni.switchTab({
					url: '/pages/index/index'
				});
			},
			//点击购买 或者规格
			clickBuy() {
				this.showBuyModal = true
			},
			//购买弹窗关闭
			closeBuy() {
				this.showBuyModal = false
			},
			//点击参数  打开参数弹窗
			openParamsModal() {
				this.showParamsModal = true
			},
			//关闭参数弹窗
			closeParamsModal() {
				this.showParamsModal = false
			}
		}
	}
</script>

<style lang="scss" scoped>
	.swiper {
		width: 100%;
		height: 750upx;

		image {
			width: 100%;
			height: 100%;
		}
	}

	.bb {
		border-bottom: 1px solid #EBEBEB;
		padding-bottom: 20upx;
	}

	.desc {
		width: 660upx;
		margin: 0 auto;

		.title {
			line-height: 1.4;
		}

		.price {
			padding: 17upx 0;

			.new {
				font-family: PingFangSC-Medium;
				font-size: 40upx;
				color: #EE7C0C;
			}

			.old {
				font-size: 28upx;
				color: #717171;
				margin-left: 34upx;
				text-decoration: line-through;
			}
		}

		.orderNum {
			color: #ACACAC;
			margin-top: 30upx;
		}

		.item {
			padding-top: 20upx;
			display: flex;

			&>text {
				color: #ACACAC;
				display: block;
				width: 120upx;
			}

			&>view {
				flex: 1;
				position: relative;
			}

			.sp {
				width: 152upx;
				height: 48upx;
				background: #EBEBEB;
				border-radius: 8upx;
				margin-top: 13upx;
				text-align: center;
				line-height: 48upx;
			}

			.rightArr::after {
				width: 20upx;
				height: 20upx;
				content: "";
				display: block;
				border-top: 2px solid #999;
				border-right: 2px solid #999;
				position: absolute;
				top: 0;
				right: 20upx;
				transform: rotate(45deg);
			}
		}
	}

	.detail {
		scroll-view{
			image{
				width:100%;
			}
		}
		.title {
			width: 280upx;
			height: 54upx;
			margin: 0 auto;
			margin-top: 40upx;
			margin-bottom:80upx;
			text-align: center;
			line-height: 54upx;
			border: 1px solid #EE7C0C;
			border-radius: 100upx;
			color: #EE7C0C;
		}
	}

	.bottom-buy {
		position: fixed;
		bottom: 0;
		width: 100%;
		height: 110upx;
		background: #fff;
		display: flex;
		align-items: center;
		padding: 0 48upx;
		justify-content: space-between;
		box-shadow: 0 -1px 4px 0 rgba(0, 0, 0, 0.05);

		.item {
			width: 76upx;
			display: flex;
			flex-direction: column;
			align-items: center;

			view {
				font-size: 24upx;
				font-family: PingFangSC-Light;
				color: #ACACAC;
				margin-top: 5upx;
			}

			image {
				width: 42upx;
				height: 42upx;
			}

		}

		.buyBtn {
			width: 400upx;
			height: 72upx;
			display: flex;

			view {
				flex: 1;
				color: #fff;
				background: #F8C018;
				text-align: center;
				line-height: 72upx;
			}

			view:last-child {
				background-color: #EE7C0C;
				border-bottom-right-radius: 36upx;
				border-top-right-radius: 36upx;
			}

			view:first-child {
				border-bottom-left-radius: 36upx;
				border-top-left-radius: 36upx;
			}
		}
	}
</style>
