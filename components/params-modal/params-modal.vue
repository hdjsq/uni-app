<template>
	<view class="main" @touchmove.stop="banScroll" v-show = "show" >
		<view class="bg"></view>
		<view class="buy-modal">
			<view class="close" @click.stop="close">
				<i class="iconfont">&#xe606;</i>
			</view>
			<view class="top">
				<view class="title">
					商品参数
				</view>
				<view class="opt">
					<text>品牌系列</text>
					<text>Sunnybeeze</text>
				</view>
				<view class="opt">
					<text>是否进口</text>
					<text>是</text>
				</view>
				<view class="opt">
					<text>产地</text>
					<text>澳大利亚</text>
				</view>
			</view>
			<view class="btn" @click.stop="close">
				确定
			</view>
		</view>
	</view>

</template>

<script>
	export default {
		props:{
			show:{
				type:Boolean
			}
		},
		data(){
			return {
			
			}
		},
		methods: {
			banScroll() {
				return false
			},
			close(){
				this.$emit('closeParamsModal')
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
		z-index:10;
	}

	.buy-modal {
		position: fixed;
		bottom: 0;
		width: 100%;
		height:570upx;
		background: #fff;
		border-top-left-radius: 20upx;
		border-top-right-radius: 20upx;
		z-index:10;
		.close{
			position: absolute;
			top:32upx;
			right:32upx;
		}
		.top {
			border-top-left-radius: 20upx;
			border-top-right-radius: 20upx;
			display:flex;
			flex-direction: column;
			// height:100%;
			padding:36upx 50upx;
			width:100%;
			.title{
				font-size: 36upx;
				color: #151515;
				text-align: center;
				margin-bottom:60upx;
			}
			.opt{
				display: flex;
				justify-content: space-between;
				padding:18upx 0;
				border-top:1px solid #EBEBEB;
				text{
					color: #717171;
				}
				text:first-child{
					color: #ACACAC;
				}
			}
		}
		.btn{
			width:360upx;
			height:72upx;
			text-align: center;
			line-height: 72upx;
			margin: 0 auto;
			margin-top:70upx;
			background: #EE7C0C;
			border-radius: 100upx;
			color: #fff;
		}
	}
</style>
