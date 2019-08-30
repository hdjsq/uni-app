<template>
	<view class="home">
		<image class="mainImg" :src="homeImg" mode="widthFix"></image>
		<view class="proList">
			<view class="proList-item" @click="goToDetail"  v-for="item in goodsList" :key="item.id">
				<view class="proList-item-left">
					<image :src="url+item.mainImage" mode="widthFix"></image>
				</view>
				<view class="proList-item-right">
					<view class="title">{{item.skuTitle}}</view>
					<view class="price">
						<text class="new">¥{{item.discountPrice}}</text>
						<text class="old">¥{{item.originalPrice}}</text>
					</view>
					<view class="buy" :data-pid="item.pid">立即购买</view>
				</view>
			</view>
			<!-- <view class="proList-item">
				<view class="proList-item-left">
					<image src="/static/test/1.png"></image>
				</view>
				<view class="proList-item-right">
					<view class="title">Sunnybeeze千年神树蜂蜜
						500g</view>
					<view class="price">
						<text class="new">¥1680</text>
						<text class="old">¥3360</text>
					</view>
					<view class="buy">立即购买</view>
				</view>
			</view>
			<view class="proList-item">
				<view class="proList-item-left">
					<image src="/static/test/1.png"></image>
				</view>
				<view class="proList-item-right">
					<view class="title">Sunnybeeze千年神树蜂蜜
						500g</view>
					<view class="price">
						<text class="new">¥1680</text>
						<text class="old">¥3360</text>
					</view>
					<view class="buy">立即购买</view>
				</view>
			</view> -->
		</view>
	</view>
</template>
<script>
    import url from '@/api/config.js';
    import {getProduct} from '@/api/api.js';
	export default {
		data() {
			return {
                homeImg: url.ossUrl + '/home/homeImg.jpg',
                goodsList:[],
                url: ''
			}
        },
        created(){
            getProduct().then(res=>{
                console.log(res);
                this.goodsList = res;
            })
        },
		methods:{
			goToDetail(e){
                console.log("去详情页")
                let pid = e.target.dataset.pid;
				uni.navigateTo({
					url: `/pages/index/detail/product-detail?pid=${pid}`,
				});
			}
		}
	};
</script>

<style lang="scss">
	page {
		background: #24293D;
	}

	.mainImg {
		width: 100%;
	}

	.proList {
		margin-top: 20upx;
		width: 650upx;
		margin-left: 50upx;
		margin-right: 50upx;
		margin-bottom:50upx;
		&-item {
			width: 100%;
			height: 300upx;
			background-color: #fff;
			border-radius: 8upx;
			display: flex;
			margin-top:24upx;
			&-left {
				width:250upx;
				display:flex;
				justify-content:center;
				align-items:center;
				image {
					width: 130upx;
					// height: 100%;
				}
			}

			&-right {
				display: flex;
				flex: 1;
				flex-direction: column;
				align-items: center;
				justify-content: center;
				// margin-left: 30upx;
				.title {
					color: #000;
				}

				.price {
					margin-top: 30upx;

					.new {
						font-size: 40upx;
						color: #EE7C0C;
					}

					.old {
						font-size: 24upx;
						color: #717171;
						text-decoration: line-through;
						margin-left: 20upx;
					}
				}

				.buy {
					width: 280upx;
					height: 52upx;
					line-height: 52upx;
					margin-top: 20upx;
					background-image: linear-gradient(-180deg, #FBD37A 0%, #CEA51B 100%);
					border-radius: 50upx;
					font-family: PingFangSC-Medium;
					color: #8D6120;
					text-align: center;
				}
			}
		}
	}
</style>
