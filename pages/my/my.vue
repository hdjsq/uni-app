<template>
    <view>
        <view class="my-title">
            <view class="my-title-left">
                <view  class="userPic"><open-data type="userAvatarUrl"></open-data></view>
                <open-data type="userNickName" class="name"></open-data>
            </view>
            <view class="my-title-right" @click="getAddress">
                <i class="iconfont address">&#xe60c;</i>
                <view class="myAddress">收货地址</view>
            </view>
        </view>

        <!-- 订单状态 -->
        <view class="orderStatus">
            <text :class="status == 2? 'active':''" @click="status = 2">待发货{{qty?'('+qty+')': ''}}</text>
            <text :class="status == 3? 'active':''" @click="status = 3">待收货{{qty?'('+qty+')': ''}}</text>
            <text :class="status == 1? 'active':''" @click="status = 1">全部订单{{qty?'('+qty+')': ''}}</text>
        </view>
        <!-- 待发货 -->
        <view class="waitDeliver" v-show="status == 2 && qty!== 0" v-for="(item,index) in orderList" :key="index">
            <view class="waitDeliver-title">等待卖家发货</view>
            <view class="orderList" @click="toDetail(status,item.id)" v-for="list in item.orderItemVos" :key="list.id">
                <image :src="list.skuMainImage+'?x-oss-process=image/resize,w_178/quality,q_70'" lazy-load="true" class="honey-img"></image>
                <view class="info">
                    <view class="info-title">{{list.prodSkuNm}}</view>
                    <view class="info-g">规格：{{list.specNm}}</view>
                    <view class="info-bottom">
                        <text class="price">¥{{list.unitPrice}}</text>
                        <view class="inputNum">x {{list.qty}}</view>
                    </view>
                </view>
            </view>
            <view class="statistics">
                <text>共{{item.qty}}件商品</text>
                <text>合计：¥{{item.totalPrice}}（含运费¥{{item.lgsPrice}}）</text>
            </view>
        </view>
        <!-- 待收货 -->
        <view class="waitReceive" v-show="status == 3 && qty!== 0" v-for="(item,index) in orderList" :key="index">
            <view class="waitReceive-title">买家确认收货</view>
            <view class="orderList" @click="toDetail(status,item.id)" v-for="list in item.orderItemVos" :key="list.id">
                <image :src="list.skuMainImage+'?x-oss-process=image/resize,w_178/quality,q_70'" lazy-load="true" class="honey-img"></image>
                <view class="info">
                    <view class="info-title">{{list.prodSkuNm}}</view>
                    <view class="info-g">规格：{{list.specNm}}</view>
                    <view class="info-bottom">
                        <text class="price">¥{{list.unitPrice}}</text>
                        <view class="inputNum">x {{list.qty}}</view>
                    </view>
                </view>
            </view>
            <view class="statistics">
                <text>共{{item.qty}}件商品</text>
                <text>合计：¥{{item.totalPrice}}（含运费¥{{item.lgsPrice}}）</text>
            </view>
            <view class="express">
                <view class="express-left">
                    <image :src="item.lgsInfoVo.expressLogo" lazy-load="true" class="express-left-icon"></image>
                    <view class="express-left-info">
                        <view class="express-name">{{item.lgsInfoVo.expressName}}</view>
                        <view class="express-number">快递单号：{{item.lgsInfoVo.waybill}}</view>
                    </view>
                </view>
                <view class="express-right">确认收货</view>
            </view>
        </view>
        <!-- 全部订单 -->
        <view class="allOrder" v-show="status == 1 && qty!== 0" v-for="(item,index) in orderList" :key="index">
            <view class="allOrder-title">买家确认收货</view>
            <view class="orderList" @click="toDetail(status,item.id)" v-for="list in item.orderItemVos" :key="list.id">
                <image :src="list.skuMainImage+'?x-oss-process=image/resize,w_178/quality,q_70'" lazy-load="true" class="honey-img"></image>
                <view class="info">
                    <view class="info-title">{{list.prodSkuNm}}</view>
                    <view class="info-g">规格：{{list.specNm}}</view>
                    <view class="info-bottom">
                        <text class="price">¥{{list.unitPrice}}</text>
                        <view class="inputNum">x {{list.qty}}</view>
                    </view>
                </view>
            </view>
            <view class="statistics">
                <text>共{{item.qty}}件商品</text>
                <text>合计：¥{{item.totalPrice}}（含运费¥{{item.lgsPrice}}）</text>
            </view>
            <view class="express">
                <view class="express-left">
                    <image :src="item.lgsInfoVo.expressLogo" lazy-load="true" class="express-left-icon"></image>
                    <view class="express-left-info">
                        <view class="express-name">{{item.lgsInfoVo.expressName}}</view>
                        <view class="express-number">快递单号：{{item.lgsInfoVo.waybill}}</view>
                    </view>
                </view>
                <view class="express-confirm">
                    <view>2019-08-21  11:20:46</view>
                    <view>确认收货</view>
                </view>
            </view>
        </view>
    </view>
</template>

<script>
    import {getOrder} from '@/api/api.js';
    export default {
        data() {
            return {
                status:2,//订单状态
                orderList:[],
                qty:0,
            }
        },
        onShow(){
            this.getOrderList();
        },
        onHide(){
            this.status = 2;
        },
        methods: {
            //跳转到订单详情
            toDetail(status,id) {
                // 去订单详情
                uni.navigateTo({
                    url: `/pages/my/order-status/order-status?status=${status}&id=${id}`
                });
            },
            //获取订单列表
            getOrderList(){
                getOrder({status:this.status}).then(res=>{
                    this.orderList = res;
                    this.qty = res.length;
                }) 
            },
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
        watch: {
            //观察订单状态
            status(newValue, oldValue) {
                if(newValue !== oldValue){
                    this.getOrderList();
                }
            }
        },
    }
</script>

<style lang="scss">
    page{
        background: #f7f7f7;
    }
    .my-title{
        width: 100%;
        height: 170upx;
        background: #F8C018;
        overflow: hidden;
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 0 75upx 0 53upx;
        &-left{
            display: flex;
            align-items: center;
            .userPic{
                width: 120upx;
                height: 120upx;
                border-radius: 50%;
                overflow: hidden;
            }
            .name{
                margin-left: 26upx;
                font-size: 28upx;
                color: #151515;
                letter-spacing: 0;
            }
        }
        .address{
            font-size: 44upx;
            text-align: center;
            color: #EE7C0C;
        }
        .myAddress{
            margin-top: 12upx;
            font-size: 28upx;
            color: #151515;
            letter-spacing: 0;
        }
    }

    .orderStatus{
        width: 100%;
        height: 120upx;
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 0 76upx 0 80upx;
        background: #F1F1F1;
        font-size: 28upx;
        color: #717171;
        letter-spacing: 0;
        .active{
            color: #151515;
            font-family: PingFang-SC-Medium;
        }
    }
    
    .waitDeliver,.waitReceive,.allOrder{
        margin-bottom: 12upx;
        width: 100%;
        background: #FFFFFF;
        height: auto!important;
        overflow: hidden;
        padding-top: 27upx;
        padding-bottom: 20upx;
        &-title{
            margin-left: 48upx;
            font-size: 24upx;
            color: #EE7C0C;
            letter-spacing: 0;
        }
        .express{
            padding: 23upx 45upx 0 48upx;
            display: flex;
            justify-content: space-between;
            align-items: center;
            &-left{
                display: flex;
                align-items: center;
                &-icon{
                    width: 80upx;
                    height: 80upx;
                }
                &-info{
                    font-size: 24upx;
                    color: #151515;
                    letter-spacing: 0;
                    margin-left: 15upx;
                }
            }
            &-right{
                width: 200upx;
                height: 72upx;
                line-height: 72upx;
                background: #EE7C0C;
                border-radius: 100upx;
                font-size: 30upx;
                color: #FFFFFF;
                letter-spacing: 0;
                text-align: center;
            }
            &-confirm{
                font-size: 24upx;
                color: #717171;
                letter-spacing: 0;
                text-align: right;
            }
        }
    }

    .orderList{
        width: 100%;
        height: 240upx;
        border-bottom: 1px solid #EBEBEB;
        box-sizing: border-box;
        padding: 26upx 45upx 0 48upx;
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
                height: 60upx;
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
    .statistics{
        padding: 8upx 27upx 0 48upx;
        display: flex;
        justify-content: space-between;
        align-items: center;
        font-size: 24upx;
        color: #717171;
        letter-spacing: 0;
    }
    
</style>
