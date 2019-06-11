import Vue from 'vue';
import firebase from 'firebase/app';
import App from './App.vue';
import router from './router';
import store from './store';

Vue.config.productionTip = false;

const config = {
  apiKey: 'AIzaSyD-PSGarP2r74pWw4iM7sVTSbS6Ur0HzYs',
  authDomain: 'platzi-rooms-9baca.firebaseapp.com',
  databaseURL: 'https://platzi-rooms-9baca.firebaseio.com',
  projectId: 'platzi-rooms-9baca',
  storageBucket: 'platzi-rooms-9baca.appspot.com',
  messagingSenderId: '382897475012',
  appId: '1:382897475012:web:ae4a1eb939983956'
};
// Initialize Firebase
firebase.initializeApp(config);

new Vue({
  router,
  store,
  render: h => h(App),
  beforeCreate() {
    if(store.state.authID) {
      this.$store.dispatch('FETCH_USER', {id: store.state.authID});
    }
  },
}).$mount('#app');
