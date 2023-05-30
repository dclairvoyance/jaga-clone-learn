import Vue from 'vue'
import { uid } from 'quasar'
import { api } from 'boot/axios'
import { authHeader } from './auth-header'

async function fetchCompanies(params) {
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
        return res
    } catch (error) {
        console.log(error)
    }
}

async function fetchCompanyDetails(id) {
    try {
        const res = await api.get('/v5/perusahaan/detail/' + id)
        return res
    } catch (error) {
        console.log(error)
    }
}

async function fetchProvinces(params) {
    try {
        const res = await api.get('/v5/bansos/provinsi_list', {
            params: {
                keyword: params.keyword,
                limit: params.limit,
                offset: params.offset
            }
        })
        return res
    } catch (error) {
        console.log(error)
    }
}

async function fetchCities(params) {
    try {
        const res = await api.get('/v5/bansos/pemda_list', {
            params: {
                id_provinsi: params.id_provinsi,
                keyword: params.keyword,
                limit: params.limit,
                offset: params.offset
            }
        })
        return res
    } catch (error) {
        console.log(error)
    }
}

async function fetchTypes() {
    try {
        const res = await api.get('/v5/perusahaan/jenis')
        return res
    } catch (error) {
        console.log(error)
    }
}

async function addCompany(company) {
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
        return res
    } catch (error) {
        console.log(error)
    }
}

async function updateCompany(company) {
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
        return res
    } catch (error) {
        console.log(error)
    }
}

async function deleteCompany(id) {
    try {
        const res = await api.post('/v5/perusahaan/delete/' + id, {}, {
            headers: authHeader()
        })
        return res
    } catch (error) {
        console.log(error)
    }
}

async function restoreCompany(id) {
    try {
        const res = await api.post('/v5/perusahaan/restore/' + id, {}, {
            headers: authHeader()
        })
        return res
    } catch (error) {
        console.log(error)
    }
}

export {
    fetchCompanies,
    fetchCompanyDetails,
    fetchProvinces,
    fetchCities,
    fetchTypes,
    addCompany,
    updateCompany,
    deleteCompany,
    restoreCompany
}