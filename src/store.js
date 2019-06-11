import Vue from 'vue';
import Vuex from 'vuex';
// import sourceData from './data.json'
import counterRoomsObject from './utils'
import firebase from 'firebase'

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    // ...sourceData,
    users: {},
    services: {},
    rooms: {},
    authID: null,
    // user: null,
    modals: {
      login: false,
      register: false
    },
  },
  mutations: {
    SET_MODAL_STATE(state, {name, value}) {
      state.modals[name] = value;
    },
    SET_ROOM(state, {newRoom, roomId}) {
      Vue.set(state.rooms, roomId, newRoom); //averiguar sobre vue.set
      //los datos que están en data vue son reactivos pero y los de afuera? para eso utilizamos vue.set. state.rooms no es reactivo. pues no está en data vue.
    },
    APPEND_ROOM_TO_USER(state, {roomId, userId}) { // roomId = parametro de la sala que se va asignar, y userId a qué usuario se va a asignar
      Vue.set(state.users[userId].rooms, roomId, roomId);
      //dentro del usuario state.users[userId].rooms le agregamos el objeto roomId (la clave de la habitación que se genero) con el mismo valor de roomId 
    },
    SET_ITEM(state, {item, id, resource}) {
      const newItem = item;
      newItem['.key'] = id;
      Vue.set(state[resource], id, newItem)
    }
  },
  actions: {
    TOGGLE_MODAL_STATE({commit}, {name, value}) {
      commit('SET_MODAL_STATE', {name, value});
    },
    CREATE_ROOM: ({state, commit}, room) => {
      const newRoom = room;
      // const roomId = `room${Math.random()}`;
      const roomId = firebase.database().ref('rooms').push().key
      // newRoom['.key'] = roomId;
      newRoom.userId = state.authID;
      newRoom.publishedAt = Math.floor(Date.now() / 1000);
      newRoom.meta = {likes: 0};

      const updates = {};
      updates[`rooms/${roomId}`] = newRoom;
      updates[`users/${newRoom.userId}/rooms/${roomId}`] = roomId;
      firebase.database().ref().update(updates).then((resolve) => {
        commit('SET_ROOM', {newRoom, roomId});
        commit('APPEND_ROOM_TO_USER', {roomId, userId: newRoom.userId});
        return Promise.resolve(state.rooms[roomId]);
      })
    },
    FETCH_ROOMS: ({ state, commit }, limit) => new Promise((resolve) => {
      let instance = firebase.database().ref('rooms');
      if(limit) {
        instance = instance.limitToFirst(limit)
      }
      instance.once('value', (snapshot) => {
        const rooms = snapshot.val();
        Object.keys(rooms).forEach((roomId) => {
          const room = rooms[roomId];
          commit('SET_ITEM', {resource: 'rooms', id: roomId, item: room});
        });
        resolve(Object.values(state.rooms));
      })
    }),
    FETCH_USER: ({state, commit}, {id}) => new Promise((resolve) => {
      firebase.database().ref('users').child(id).once('value', (snapshot) => {
        commit('SET_ITEM', {resource: 'users', id: snapshot.key, item: snapshot.val()});
        resolve(state.users[id]);
      })
    }),
    CREATE_USER: ({state, commit}, {email, name, password}) => new Promise((resolve) => {
      firebase.auth().createUserWithEmailAndPassword(email, password).then((account) => {
        const id = account.user.uid;
        const registeredAt = Math.floor(Date.now() / 1000);
        const newUser = {email, name, registeredAt};
        firebase.database().ref('users').child(id).set(newUser)
          .then(() => {
            commit('SET_ITEM', {resource: 'users', id, item: newUser});
            resolve(state.users[id])
          })

      })
    })

  },
  getters: {
    modals: state => state.modals,
    authUser: state => state.users[state.authID],
    rooms: state => state.rooms,
    userRoomsCount: state => (id) => counterRoomsObject(state.users[id].rooms),
  },
});
