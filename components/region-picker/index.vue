<template>
	<view class="">
					<picker mode="region" @change="bindPickerChange" :value="region">
						<view class="uni-input">
							<text v-for = "item in region" :key="item" :class="region[2] ? '':'empty'">
								{{item}}
							</text>
						</view>
					</picker>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				region: ['请选择', '', ''],
			}
		},
		computed: {
		
		},
		methods: {
			bindPickerChange: function(e) {
				console.log('picker发送选择改变，携带值为', e.target.value)
				this.region = e.target.value
			},
		}
	}
</script>

<style scoped>
	.empty{
		color: #717171;
	}
	
</style>
