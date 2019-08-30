<template>
    <view>
        <view class="addressList">
            <text class="addressLeft">收货人</text>
            <input type="text" placeholder="请填写收货人姓名"  placeholder-style="text-align:right;color: #717171;"/>
        </view>
        <view class="addressList">
            <text class="addressLeft">手机号码</text>
            <input type="text" placeholder="请填写收货人手机号" placeholder-style="text-align:right;color: #717171;"/>
        </view>
        <view class="addressList">
            <text class="addressLeft">所在地区</text>
            <view class="picker">
                <RegionPicker></RegionPicker>
                <i class="iconfont toPicker">&#xe63d;</i>
            </view>
            
        </view>
        <view class="addressList">
            <text class="addressLeft">详细地址</text>
            <input type="text" placeholder="请填写详细地址" placeholder-style="text-align:right;color: #717171;"/>
        </view>
        <view class="addressList">
            <text class="addressLeft">设为默认地址</text>
            <switch color="#EE7C0C"/>
        </view>
        <view class="confirm">确认</view>
    </view>
</template>

<script>
    import RegionPicker from '@/components/region-picker/index.vue';
    export default {
        components: {
            RegionPicker
        },
    };
</script>

<style lang="scss">
    .addressList {
        height: 122upx;
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin: 0 46upx 0 50upx;
        box-sizing: border-box;
        border-bottom: 1upx solid #ebebeb;
        .addressLeft {
            font-size: 30upx;
            color: #151515;
            letter-spacing: 0;
        }
        input{
            width: 270upx;
            color: #717171;
        }
        .picker{
            display: flex;
            align-items: center;
            .toPicker{
                font-size: 26upx;
                color: #979797;
            }
        }
    }
    .confirm{
        position: fixed;
        bottom: 29upx;
        left: 0;
        right: 0;
        margin: auto;
        width: 360upx;
        height: 72upx;
        background: #EE7C0C;
        border-radius: 100upx;
        line-height: 72upx;
        font-size: 30upx;
        color: #FFFFFF;
        letter-spacing: 0;
        text-align: center;
    }
</style>