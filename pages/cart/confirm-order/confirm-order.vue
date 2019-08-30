<template>
    <view>
        <view class="address"  @click="getAddress">
            <view class="address-left">
                <i class="iconfont addressIcon">&#xe60c;</i>
               <view class="selectAddress" v-if="!address">
                    <view class="blackA">获取微信收货地址</view>
                    <!-- <view class="gain">请选择收获地址</view> -->
                </view>
				<view class="hadAddress" v-else>
					<view class="top">
						<text>{{address.userName}}</text>
						<text>{{address.telNumber}}</text>
					</view>
					<view class="bottom">
						<text>{{fulladdress}}</text>
					</view>
				</view>
            </view>
            <i class="iconfont toAddress">&#xe63d;</i>
            <!-- <image src="/static/test/right.png" class="toAddress" mode="aspectFit" @click="toAddress"></image> -->
        </view>
        <!-- 订单列表 -->
        <view class="order">
            <view class="orderList" v-for="item in orderList" :key="item.id">
                <image :src="item.skuImg" class="honey-img"></image>
                <view class="info">
                    <view class="info-title">{{item.prodTitle}}</view>
                    <view class="info-g">规格：{{item.specNm}}</view>
                    <view class="info-bottom">
                        <text class="price">¥{{item.unitPrice}}</text>
                        <view class="inputNum">x {{item.qty}}</view>
                    </view>
                </view>
            </view>
        </view>
        <!-- 订单备注级及快递 -->
        <view class="tips">
            <view class="remark">
                <text>订单备注</text>
                <input type="text" placeholder="选填，请和客服协商一致哦" v-model="remarks" placeholder-style="color: #ACACAC;text-align:right;">
            </view>
            <view class="express">
                <text>快递配送</text>
                <text>快递费用 ¥0</text>
            </view>
        </view>
        <!-- 底部提交订单 -->
        <view class="order-bottom">
            <view class="totalNum">共计2件</view>
            <view class="totalWrap">
                <view class="total">
                    <text>合计：</text>
                    <text class="totalPrice">¥{{cartPrice}}</text>
                </view>
                <view class="settlement" @click="addOrder">提交订单</view>
            </view>
        </view>
    </view>
</template>

<script>
	import {
		addOrder,
		prePay
	} from '@/api/api.js';
    export default {
		data(){
			return {
				address:null,
				orderList:[],
				cartPrice:0
			}
		},
		computed:{
			//计算属性   不确定是否可用
			fulladdress (){
				let address = this.address;
				if(!address) return
				return address.provinceName + address.cityName + address.countyName + address.detailInfo
			}
		},
        methods: {
			//初始 接收参数
			 onLoad (option) { 
				 let params = JSON.parse(option.params);
				 console.log(params);
				 let orderList = params.orderList;
				 for(let i in orderList){
					 orderList[i].prodTitle = orderList[i].prodTitle.split(' ')[0];
				 }
				 this.orderList = params.orderList;
				 this.cartPrice = params.cartPrice;
				 this.source = params.source;
			    },
			//下单
			addOrder(){
				let address = this.address;
				if(!address){
					uni.showModal({
						title: '提示',
						content: '请先获取地址',
						showCancel: false,
					});
					return
				}
				// console.log(res.userName)
				// console.log(res.postalCode)
				// console.log(res.provinceName)
				// console.log(res.cityName)
				// console.log(res.countyName)
				// console.log(res.detailInfo)
				// console.log(res.nationalCode)
				// console.log(res.telNumber)
				let data = {
					deliInfo:{
						addr:address.detailInfo,
						city:address.cityName,
						dist:address.countyName,
						mobile:address.telNumber,
						name:address.userName,
						prov:address.provinceName
					},
					remarks:this.remarks,
					source:this.source
				}
				let skuInfos = []
				this.orderList.map((child)=>{
					let {
						qty,
						skuId
					} = child;
					let obj = {
						qty,
						skuId
					}
					skuInfos.push(obj)
				})
				data.skuInfos = skuInfos;
				addOrder(data).then((res)=>{
					let { ordCd } = res;
					prePay(res).then((data)=>{
						console.log(data)
					})
				})
			},
			//暂时无用
            // toAddress() {
            //     uni.navigateTo({
            //         url: '/pages/cart/address/address'
            //     });
            // },
			// getDefaultAdd(){
			// 	uni.getSetting({
			// 	  success(res) {
			// 	    console.log("vres.authSetting['scope.address']：",res.authSetting['scope.address'])
			// 	    if (res.authSetting['scope.address']) {
			// 	      uni.chooseAddress({
			// 	        success(res) {
			// 	          console.log(res.userName)
			// 	          console.log(res.postalCode)
			// 	          console.log(res.provinceName)
			// 	          console.log(res.cityName)
			// 	          console.log(res.countyName)
			// 	          console.log(res.detailInfo)
			// 	          console.log(res.nationalCode)
			// 	          console.log(res.telNumber)
			// 	        }
			// 	      })
			// 	    } 
			// 	  }
			// 	})
			// },
			//微信原生地址组件
			getAddress() {
			    uni.getSetting({
			      success:(res) => {
			        console.log("vres.authSetting['scope.address']：",res.authSetting['scope.address'])
			        if (res.authSetting['scope.address']) {
			          uni.chooseAddress({
			            success:(res) => {
							this.address = res;
			              console.log(res.userName)
			              console.log(res.postalCode)
			              console.log(res.provinceName)
			              console.log(res.cityName)
			              console.log(res.countyName)
			              console.log(res.detailInfo)
			              console.log(res.nationalCode)
			              console.log(res.telNumber)
			            }
			          })
			              
			        } else {
			          if (res.authSetting['scope.address'] == false) {
			            console.log("222")
			            uni.openSetting({
			              success(res) {
			                console.log(res.authSetting)
			              }
			            })
			          } else {
			            uni.chooseAddress({
			              success:(res) => {
							  this.address = res;
			                console.log(res.userName)
			                console.log(res.postalCode)
			                console.log(res.provinceName)
			                console.log(res.cityName)
			                console.log(res.countyName)
			                console.log(res.detailInfo)
			                console.log(res.nationalCode)
			                console.log(res.telNumber)
			              }
			            })
			          }
			        }
			      }
			    })
			  }
        },
    }
</script>
<style lang="scss">
    page{
        background-color: #f7f7f7;
        padding-bottom: 93upx;
    }
    .address{
        position: fixed;
        left: 0;
        top: 0;
        width: 100%;
        overflow: hidden;
        background: #FFFFFF;
        height: 170upx;
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 0 48upx;
        box-sizing: border-box;
        &-left{
            display: flex;
            align-items: center;
            .addressIcon{
                font-size: 50upx;
                color: #FFA942;
            }
            .selectAddress{
                margin-left: 36upx;
                .blackA{
                    font-size: 28upx;
                    color: #151515;
                    letter-spacing: 0;
                }
                .gain{
                    font-size: 27upx;
                    color: #ACACAC;
                    letter-spacing: 0;
                }
            }
			.hadAddress{
				margin-left:36upx;
				.bottom{
					margin-top:14upx;
				}
				text:first-child{
					margin-right:20upx;
				}
			}
        }
        .toAddress{
            font-size: 34upx;
            color: #979797;
        }
    }
    .order{
        margin-top: 184upx;
        width: 100%;
        // overflow: auto;
        // height: 480upx;
        background: #FFFFFF;
        .orderList{
            width: 100%;
            height: 240upx;
            border-bottom: 1px solid #EBEBEB;
            box-sizing: border-box;
            padding: 26upx 45upx 0 50upx;
            display: flex;
            .honey-img{
                width: 178upx;
                height: 178upx;
                border: 1upx solid rgb(151,151,151);
            }
            .info{
                width: 456upx;
                margin-left: 20upx;
                &-title{
                    width: 100%;
                    font-size: 24upx;
                    color: #151515;
                    letter-spacing: 0;
                    line-height: 30upx;
                    overflow: hidden;
                    text-overflow: ellipsis;
                    /*设置成弹性盒子 */
                    display: -webkit-box;
                    /*显示的个数 */
                    -webkit-line-clamp: 2;
                    /* 属性规定框的子元素应该被水平或垂直排列。 */
                    -webkit-box-orient: vertical;
                }
                &-g{
                    font-size: 24upx;
                    color: #717171;
                    letter-spacing: 0;
                    margin-top: 21upx;
                }
                &-bottom{
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-top: 30upx;
                    .price{
                        font-size: 30upx;
                        color: #EE7C0C;
                        letter-spacing: 0;
                    }
                    .inputNum{
                        font-size: 34upx;
                        color: #717171;
                        letter-spacing: 0;
                    }
                }
            }
        }
        .orderList:last-child{
            border-bottom: 0;
        }
    }

    .tips{
        // position: fixed;
        background: #FFFFFF;
        width: 100%;
        height: 315upx;
        left: 0;
        bottom: 107upx;
        >view{
            width: 100%;
            height: 156upx;
            display: flex;
            justify-content: space-between;
            align-items: center;
            box-sizing: border-box;
            padding: 0 48upx 0 50upx;
        }
        .remark{
            border-bottom: 1px solid #EBEBEB;
            font-size: 28upx;
            color: #151515;
            letter-spacing: 0;
            input{
                width: 340upx;
                color: #ACACAC;
            }
        }
        .express{
            font-size: 28upx;
            color: #151515;
            letter-spacing: 0;
            >text:last-child{
                color: #ACACAC;
            }
        }
    }
    .order-bottom{
        position: fixed;
        left: 0;
        bottom: 0;
        width: 100%;
        height: 93upx;
        background: #FFFFFF;
        box-sizing: border-box;
        padding: 0 45upx 0 48upx;
        display: flex;
        justify-content: space-between;
        align-items: center;
        overflow: hidden;
        z-index: 10;
        .totalNum{
            font-size: 28upx;
            color: #717171;
            letter-spacing: 0;
        }
        .totalWrap{
            display: flex;
            align-items: center;
            .total{
                font-size: 28upx;
                color: #717171;
                letter-spacing: 0;
                &Price{
                    font-size: 30upx;
                    color: #EE7C0C;
                }
            }
            .settlement{
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
        }
    }
</style>