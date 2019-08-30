<template>
	<view class="content">
		<image class="logo" src="/static/logo.png"></image>
		<view>
			<!-- <text class="title">{{title}}</text> -->
			<text class="title">测试vuex:{{vuextest}}</text>
			<div @click="add">点击测试vuex1</div>
		</view>

		<view @click="testA">获取action内容</view>
		<view v-for="(item,index) in actiontest" :key="index">{{index}}:{{item}}</view>

		
		<Test :alldata="childData" @getdata="test"></Test>
	</view>
</template>

<script>
	import Test from '@/components/Test.vue';
	import util from '@/common/util.js';
	import {
		mapState,
		mapMutations,
		mapActions
	} from 'vuex'
	export default {
		computed: {
			...mapState([
				'hasLogin',
				'vuextest',
				'actiontest'
			]),

		},
		components: {
			Test
		},
		data() {
			return {
				title: 'Hello',
				childData: {
					haha: '测试一个公共组件'
				}
			}
		},
		onLoad() {

		},
		mounted() {
			console.log(util)
		},
		methods: {
			...mapMutations(['add']),
			...mapActions(['testaction']),
			// vue父子组件交互
			test(canshu) {
				console.log(canshu);
				console.log('试试父子交互');
			},
			testA() {
				let data = {
					test: 1,
					test2: 2
				}
				this.testaction(data)
			}
		}
	}
</script>

<style scoped>
	.content {
		text-align: center;
		height: 400upx;
	}

	.logo {
		height: 200upx;
		width: 200upx;
		margin-top: 200upx;
	}

	.title {
		font-size: 36upx;
		color: #8f8f94;
	}
</style>
