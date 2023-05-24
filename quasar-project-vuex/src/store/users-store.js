import Vue from 'vue'

const state = {
    users: {
        'ID1': {
            avatar: "https://jaga.id/datachallenge/img/logojaga.png",
            username: "username1",
            name: "nama",
            email: "email",
            role: "role",
            active: false,
            id: 'ID1',
        },
        // 'ID2': {
        //     avatar: "https://jaga.id/datachallenge/img/logojaga.png",
        //     username: "username2",
        //     name: "nama",
        //     email: "email",
        //     role: "role",
        //     active: true,
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
    }
}

const actions = {
    deleteUser({ commit }, id) {
        commit('deleteUser', id)
    },
    addUser({ commit }, user) {
        commit('addUser', user)
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