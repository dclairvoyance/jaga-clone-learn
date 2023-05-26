import Vue from 'vue'
import { api } from 'boot/axios'
import { authHeader } from '../services/auth-header'

const userLocal = JSON.parse(localStorage.getItem('user'))
const initialState = userLocal
    ? { loggedIn: true, user: userLocal }
    : { loggedIn: false, user: null}
    

const state = {
    user: initialState
}

const mutations = {
    login(state, user) {
        state.loggedIn = true
        state.user = user
    }
}

const actions = {
    async login({ commit }, user) {
        console.log(authHeader())
        try {
            const res = await api.post('/v5/auth/login', { username: user.username, password: user.password })
            console.log(res.data.success)
            if (res.data.success) {
                localStorage.setItem('user', JSON.stringify(res.data.data.token))
                commit('login', res.data.data.token)
                this.$router.push('/profile')
            } else {
                console.log(res.data.message)
            }
        } catch (error) {
            console.log(error)
        }
    }
}

const getters = {
    user: (state) => {
        return state.user
    }
}

export default {
    namespaced: true,
    state,
    mutations,
    actions,
    getters
}