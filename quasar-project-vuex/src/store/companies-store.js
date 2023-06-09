import Vue from 'vue'
import { uid } from 'quasar'
import { api } from 'boot/axios'
import { authHeader } from '../services/auth-header'

const state = {
    companies: [
        // {
        //     "id": 99,
        //     "nama": "AKHDANI",
        //     "alamat": null,
        //     "jenis": "SWASTA",
        //     "kode_provinsi": "99",
        //     "provinsi": "Jawa Barat",
        //     "kode_kab_kota": "9999",
        //     "kab_kota": "BANDUNG",
        //     "created_at": "2023-05-25 12:12:12",
        //     "updated_at": null,
        //     "deleted_at": null
        // }
    ],
    provinces: [

    ],
    cities: [

    ],
    types: [

    ],
    companyDetails: [

    ]
}

const mutations = {
    deleteCompany(state, id) {
        delete state.companies[id]
    },
    addCompany(state, company) {
        state.companies[company.id] = company.company
    },
    updateCompany(state, company) {
        Object.assign(state.companies[company.id], company.updates)
    },
    fetchCompanies(state, companies) {
        state.companies = companies
    },
    fetchCompanyDetails(state, companyDetails) {
        state.companyDetails = companyDetails
    },
    fetchProvinces(state, provinces) {
        state.provinces = provinces
    },
    fetchCities(state, cities) {
        state.cities = cities
    },
    fetchTypes(state, types) {
        state.types = types
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
    },
    async fetchCompanies({ commit }, params) {
        // console.log("request with limit", params.limit, "and offset", params.offset)
        try {
            const res = await api.get('/v5/perusahaan', {
                params: {
                    keyword: params.keyword,
                    kode_provinsi: params.kode_provinsi,
                    kode_kab_kota: params.kode_kab_kota,
                    limit: params.limit,
                    offset: params.offset
                }
            })
            commit('fetchCompanies', res.data.data)
        } catch (error) {
            console.log(error)
        }
    },
    async fetchCompanyDetails({ commit }, id) {
        try {
            const res = await api.get('/v5/perusahaan/detail/' + id)
            commit('fetchCompanyDetails', res.data.data)
        } catch (error) {
            console.log(error)
        }
    },
    async fetchProvinces({ commit }, params) {
        try {
            const res = await api.get('/v5/bansos/provinsi_list', {
                params: {
                    keyword: params.keyword,
                    limit: params.limit,
                    offset: params.offset
                }
            })
            commit('fetchProvinces', res.data.data.result)
        } catch (error) {
            console.log(error)
        }
    },
    async fetchCities({ commit }, params) {
        try {
            const res = await api.get('/v5/bansos/pemda_list', {
                params: {
                    id_provinsi: params.id_provinsi,
                    keyword: params.keyword,
                    limit: params.limit,
                    offset: params.offset
                }
            })
            commit('fetchCities', res.data.data.result)
        } catch (error) {
            console.log(error)
        }
    },
    async fetchTypes({ commit }) {
        try {
            const res = await api.get('/v5/perusahaan/jenis')
            commit('fetchTypes', res.data.data)
        } catch (error) {
            console.log(error)
        }
    },
    async addCompany({ commit }, company) {
        try {
            const res = await api.post('/v5/perusahaan/create', {
                nama: company.name,
                kode_provinsi: company.id_province,
                kode_kab_kota: company.id_city,
                jenis: company.type,
                alamat: company.address
            }, {
                headers: authHeader()
            })
        } catch (error) {
            console.log(error)
        }
    },
    async updateCompany({ commit }, company) {
        try {
            const res = await api.post('/v5/perusahaan/update/' + company.id, {
                nama: company.updates.name,
                kode_provinsi: company.updates.id_province,
                kode_kab_kota: company.updates.id_city,
                jenis: company.updates.type,
                alamat: company.updates.address
            }, {
                headers: authHeader()
            })
        } catch (error) {
            console.log(error)
        }
    },
    async deleteCompany({ commit }, id) {
        try {
            const res = await api.post('/v5/perusahaan/delete/' + id, {}, {
                headers: authHeader()
            })
        } catch (error) {
            console.log(error)
        }
    },
    async restoreCompany({ commit }, id) {
        try {
            const res = await api.post('/v5/perusahaan/restore/' + id, {}, {
                headers: authHeader()
            })
        } catch (error) {
            console.log(error)
        }
    },
}

const getters = {
    companies: (state) => {
        return state.companies
    },
    provinces: (state) => {
        return state.provinces
    },
    cities: (state) => {
        return state.cities
    },
    types: (state) => {
        return state.types
    },
    companyDetails: (state) => {
        return state.companyDetails
    }
}

export default {
    namespaced: true,
    state,
    mutations,
    actions,
    getters
}