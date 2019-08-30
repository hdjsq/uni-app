import { postData, getData } from './request.js'

//首页 获取商品列表
export function getSkuList() {
  return getData('/prodsku/getSkuList');
}
//prod/getProdDetail
export function getProdDetail(data) {
  return getData('/prod/getProdDetail',data);
}
//登录
export function login(data) {
  return getData('/user/userlogin/login',data);
}
//注册
export function register(data) {
  return postData('/user/userlogin/register',data);
}

//首页
// 商品数据
export function getProduct(data){
    return getData('/prodsku/getSkuList',data);
}



//购物车

//查询
export function getCart() {
  return getData('/cart/getCart');
}
//修改购物车数量
export function updCart(data) {
  return postData('/cart/updCart',data);
}
//删除购物车商品
export function delCart(data) {
  return postData('/cart/delCart',data);
}
//添加购车
export function addCart(data) {
  return postData('/cart/addCart',data);
}

//下单
export function addOrder(data) {
  return postData('/order/addOrd',data);
}
//预支付
export function prePay(data) {
  return postData('/pay/prepay',data);
}
//我的订单
export function getOrder(data){
    return getData('/order/getOrd',data);
}

//订单详情
export function orderDetail(data){
    return getData('/order/getOrdDetail',data);
}
