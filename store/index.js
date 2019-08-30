import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)
const store = new Vuex.Store({
	state: {
		hasLogin: false,
		userInfo: {},
		vuextest:1,
        actiontest:{}
	},
	mutations: {
		add(state){
			state.vuextest++;
		},
		login(state, provider) {
			state.hasLogin = true;
			state.userInfo = provider;
			uni.setStorage({//缓存用户登陆状态
			    key: 'userInfo',  
			    data: provider  
			}) 
			console.log(state.userInfo);
		},
		logout(state) {
			state.hasLogin = false;
			state.userInfo = {};
			uni.removeStorage({  
                key: 'userInfo'  
            })
		},
		changeData(state,data){
			state.actiontest = data
        },
	},
	actions: {
		testaction({commit},data){
			setTimeout(()=>{
				commit('changeData',data)
			})
        }
	}
})

export default store
