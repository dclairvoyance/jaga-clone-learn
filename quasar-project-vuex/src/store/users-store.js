import Vue from 'vue'
import { uid } from 'quasar'

const state = {
    users: {
        // 'ID1': {
        //     avatar: "https://jaga.id/datachallenge/img/logojaga.png",
        //     username: "username1",
        //     name: "nama",
        //     email: "email",
        //     roles: ["pengguna", "pegawai"],
        //     active: false,
        //     gender: "",
        //     id: 'ID1',
        // },
        // 'ID2': {
        //     avatar: "https://jaga.id/datachallenge/img/logojaga.png",
        //     username: "username2",
        //     name: "nama",
        //     email: "email",
        //     roles: [],
        //     active: true,
        //     gender: "",
        //     id: 'ID2',
        // }
    }
}

const mutations = {
    deleteUser(state, id) {
        delete state.users[id]
        // Vue.delete(state.users, id)
    },
    addUser(state, user) {
        // Vue.set(state.users, user.id, user.user)
        state.users[user.id] = user.user
    },
    updateUser(state, user) {
        Object.assign(state.users[user.id], user.updates)
    }
}

const actions = {
    deleteUser({ commit }, id) {
        commit('deleteUser', id)
    },
    addUser({ commit }, user) {
        let userId = uid()
        user.id = userId
        let newUser = {
            id: userId,
            user: user
        }
        commit('addUser', newUser)
    },
    updateUser({ commit }, user) {
        commit('updateUser', user)
    }
}

const getters = {
    users: (state) => {
        return state.users
    }
}

export default {
    namespaced: true,
    state,
    mutations,
    actions,
    getters
}