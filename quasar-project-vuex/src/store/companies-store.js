import Vue from 'vue'
import { uid } from 'quasar'

const state = {
    companies: [
        {
            "id": 99,
            "nama": "AKHDANI",
            "alamat": null,
            "jenis": "SWASTA",
            "kode_provinsi": "99",
            "provinsi": "Jawa Barat",
            "kode_kab_kota": "9999",
            "kab_kota": "BANDUNG",
            "created_at": "2023-05-25 12:12:12",
            "updated_at": null,
            "deleted_at": null
        }
    ]
}

const mutations = {
    deleteCompany(state, id) {
        delete state.companies[id]
    },
    addCompany(state, company) {
        console.log(company)
        state.companies[company.id] = company.company
    },
    updateCompany(state, company) {
        Object.assign(state.companies[company.id], company.updates)
    }
}

const actions = {
    deleteCompany({ commit }, id) {
        commit('deleteCompany', id)
    },
    addCompany({ commit }, company) {
        let companyId = uid()
        company.id = companyId
        let newCompany = {
            id: companyId,
            company: company
        }
        commit('addCompany', newCompany)
    },
    updateCompany({ commit }, company) {
        commit('updateCompany', company)
    }
}

const getters = {
    companies: (state) => {
        console.log("tes")
        return state.companies
    }
}

export default {
    namespaced: true,
    state,
    mutations,
    actions,
    getters
}