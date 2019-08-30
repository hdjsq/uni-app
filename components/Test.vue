<template>
	<view> <text @tap="godata">子组件</text>
		<view>{{alldata.haha}}</view>
	</view>
</template>
<script>
	export default {
		props: {
			alldata: {
				type: Object
			}
		},
		methods: {
			godata: function() {
				let testdata = 123;
				this.$emit('getdata', testdata);
			}
		}
	}
</script>
