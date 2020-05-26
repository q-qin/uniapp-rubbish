const state = {
	loginShow:false,
};


const mutations = {
	showLogin(state){
		state.loginShow = true;
	},
	hideLogin(state){
		state.loginShow = false;
	}
};


export default {
	namespaced: true,
	state,
	mutations
}
