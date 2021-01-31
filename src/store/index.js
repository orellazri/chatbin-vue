import Vue from 'vue'
import Vuex from 'vuex'

import firebase from '@/firebase';

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    userId: ''
  },
  mutations: {
    changeUserId(state, userId) {
      state.userId = userId;
    }
  },
  actions: {
    async logIn() {
      const user = await firebase.auth().signInAnonymously();
      this.commit("changeUserId", firebase.auth().currentUser.uid);
    }
  },
  modules: {
  }
})
