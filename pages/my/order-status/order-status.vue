<template>
    <view>
        <view class="orderDetail">
            <view v-show="status == 2">订单状态：等待卖家发货</view>
            <view v-show="status == 3">订单状态：等待买家收货</view>
            <view v-show="status == 1">订单状态：买家确认收货</view>
            <view>订单编号：{{cd}}</view>
            <view>下单时间：{{ordTm}}</view>
            <view>订单金额：￥{{totalPrice}}</view>
            <view>快递费用：￥{{expressPrice}}</view>
            <view>实付金额：￥{{payPrice}}</view>
            <view>订单备注：{{remarks}}</view>
        </view>
        <view class="userAddress">
            <i class="iconfont addressIcon">&#xe60c;</i>
            <view class="userAddress-right">
                <view class="top">
                    <text class="name">{{name}}</text>
                    <text class="phone">{{mobile}}</text>
                </view>
                <view class="detailAddress">{{address}}</view>
            </view>
        </view>
        <view class="express" v-show="status == 3">
            <view class="express-left">
                <image :src="expressLogo" lazy-load="true" class="express-left-icon"></image>
                <view class="express-left-info">
                    <view class="express-name">{{expressName}}</view>
                    <view class="express-number">快递单号：{{waybill}}</view>
                </view>
            </view>
            <view class="express-right">确认收货</view>
        </view>
        <view class="express" v-show="status == 1">
            <view class="express-left">
                <image :src="expressLogo" lazy-load="true" class="express-left-icon"></image>
                <view class="express-left-info">
                    <view class="express-name">{{expressName}}</view>
                    <view class="express-number">快递单号：{{waybill}}</view>
                </view>
            </view>
            <view class="express-confirm">
                <view>2019-08-21  11:20:46</view>
                <view>确认收货</view>
            </view>
        </view>
        <view class="order">
            <view class="orderList" v-for="item in orderList" :key="item.id">
                <image :src="item.skuMainImage+'?x-oss-process=image/resize,w_178/quality,q_70'" lazy-load="true" class="honey-img"></image>
                <view class="info">
                    <view class="info-title">{{item.prodSkuNm}}</view>
                    <view class="info-g">规格：{{item.specNm}}</view>
                    <view class="info-bottom">
                        <text class="price">¥{{item.unitPrice}}</text>
                        <view class="inputNum">x {{item.qty}}</view>
                    </view>
                </view>
            </view>
        </view>
        
    </view>
</template>

<script>
    import {orderDetail} from '@/api/api.js';
    export default {
        data() {
            return {
                status: 1,//订单状态
                cd:'',//订单编号
                ordTm:'',//下单时间
                totalPrice:'',//订单金额
                payPrice:'',//实付金额
                expressPrice:'',//快递金额
                remarks:'',//订单备注
                name:'',//收件人
                mobile:'',//手机号
                address:'',//收件地址
                orderList:'',//订单子项
                expressLogo:'',//快递公司图标
                expressName:'',//快递公司名称
                waybill:'',//运单号
            }
        },
        onLoad(option){
            console.log(option);
            this.status = option.status;
            orderDetail({id:option.id}).then(res=>{
                console.log(res);
                this.cd = res.cd;
                this.ordTm = res.ordTm;
                this.totalPrice = res.totalPrice.toFixed(2);
                this.payPrice = res.payPrice.toFixed(2);
                this.expressPrice = res.lgsPrice.toFixed(2);
                this.remarks = res.remarks;
                this.name = res.deliInfo.name;
                this.mobile = res.deliInfo.mobile;
                this.address = res.deliInfo.prov + res.deliInfo.city + res.deliInfo.dist +　res.deliInfo.addr;
                this.orderList = res.orderItemVos;
                this.expressLogo = res.lgsInfoVo.expressLogo;
                this.expressName = res.lgsInfoVo.expressName;
                this.waybill = res.lgsInfoVo.waybill;
            })
        }
    }
</script>

<style lang="scss">
    page{
        background: #f7f7f7;
    }
    .orderDetail{
        width: 100%;
        overflow: hidden;
        padding: 42upx 0 36upx 48upx;
        background: #FFFFFF;
        view{
            font-size: 28upx;
            line-height: 40upx;
            color: #717171;
            letter-spacing: 0;
        }
    }
    .userAddress{
        margin-top: 12upx;
        background: #FFFFFF;
        width: 100%;
        height: 152upx;
        padding: 32upx 48upx 0;
        overflow: hidden;
        display: flex;
        .addressIcon{
            font-size: 36upx;
            color: #EE7C0C;
        }
        &-right{
            margin-left: 17upx;
            font-size: 24upx;
            color: #151515;
            letter-spacing: 0;
            line-height: 30upx;
            .top{
                .name{
                    margin-right: 56upx;
                }
            }
            .detailAddress{
                margin-top: 8upx;
            }
        }
    }
    .order{
        margin-top: 12upx;
    }
    .orderList{
        width: 100%;
        height: 240upx;
        border-bottom: 1px solid #EBEBEB;
        box-sizing: border-box;
        padding: 26upx 45upx 0 48upx;
        background: #FFFFFF;
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
                height: 60upx;
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

    .express{
        background: #FFFFFF;
        padding: 23upx 45upx 24upx 48upx;
        display: flex;
        justify-content: space-between;
        align-items: center;
        border-top: 1upx solid #EBEBEB;
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

</style>