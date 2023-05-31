<template>
    <q-page class="page-color q-px-lg q-py-md">
        <q-page class="item-color shadow-6">
            <div class="row text-h1 q-px-lg q-py-lg text-weight-bold page-header">
                Companies Management
            </div>
            <q-separator />
            <q-table class="q-ma-lg" bordered row-key="id" v-model:pagination="pagination" @request="onRequest"
                :loading="loadingTable" :rows="companies" :columns="[
                    {
                        label: 'ID',
                        name: 'id',
                        field: 'id',
                        sortable: true,
                        align: 'center'
                    },
                    {
                        label: 'Nama',
                        name: 'nama',
                        field: 'nama',
                        sortable: true,
                        align: 'left'
                    },
                    {
                        label: 'Alamat',
                        field: 'alamat',
                        name: 'alamat',
                        sortable: true,
                        align: 'left'
                    },
                    {
                        label: 'Jenis',
                        field: 'jenis',
                        name: 'jenis',
                        sortable: true,
                        align: 'left'
                    },
                    {
                        label: 'Kode Provinsi',
                        field: 'kode_provinsi',
                        name: 'kode_provinsi',
                        sortable: true,
                        align: 'center'
                    },
                    {
                        label: 'Provinsi',
                        field: 'provinsi',
                        name: 'provinsi',
                        sortable: true,
                        align: 'left'
                    },
                    {
                        label: 'Kode Kab/Kota',
                        field: 'kode_kab_kota',
                        name: 'kode_kab_kota',
                        sortable: true,
                        align: 'center'
                    },
                    {
                        label: 'Kab/Kota',
                        field: 'kab_kota',
                        name: 'kab_kota',
                        sortable: true,
                        align: 'left'
                    },
                    {
                        label: 'Aksi',
                        field: '',
                        name: 'action',
                        align: 'center'
                    },
                ]">
                <template v-slot:top-right>
                    <q-input v-model="search" borderless dense debounce="300" placeholder="Search"
                        @update:model-value="filterSearch()">
                        <template v-slot:append>
                            <q-icon name="search" />
                        </template>
                    </q-input>
                </template>
                <template v-slot:top-left>
                    <q-select color="secondary"
                        style="min-width:200px; margin-right: 16px; margin-bottom: 8px; margin-top: 8px"
                        label-color="grey-8" filled v-model="filterTypes" multiple :options="typeOptions" use-chips
                        stack-label label="Filter Jenis" @update:model-value="filterSearch()">
                        <template v-slot:prepend>
                            <q-icon name="checklist" />
                        </template>
                    </q-select>
                    <q-select color="secondary"
                        style="min-width:200px; margin-right: 16px; margin-bottom: 8px; margin-top: 8px"
                        label-color="grey-8" filled v-model="filterProvinces" multiple :options="provinceOptions" use-chips
                        stack-label label="Filter Provinsi" @update:model-value="filterSearch()">
                        <template v-slot:prepend>
                            <q-icon name="house" />
                        </template>
                    </q-select>
                    <q-select color="secondary" v-if="filterProvinces.length > 0"
                        style="min-width:200px; margin-right: 16px; margin-bottom: 8px; margin-top: 8px"
                        label-color="grey-8" filled v-model="filterCities" multiple :options="cityOptions" use-chips
                        stack-label label="Filter Kab/Kota" @update:model-value="filterSearch()"
                        :loading="loadingCityOptions">
                        <template v-slot:prepend>
                            <q-icon name="home" />
                        </template>
                    </q-select>
                </template>
                <template v-slot:body-cell-action="action">
                    <q-td :props="action">
                        <q-btn flat icon="info" @click="showDialogDetails(action.row.id)" />
                        <q-btn flat icon="edit" @click="showDialogEdit(action.row.id)" />
                        <q-btn v-if="!action.row.deleted_at" flat icon="delete" @click="showDialogDelete(action.row.id)" />
                        <q-btn v-if="action.row.deleted_at" flat icon="restore_from_trash"
                            @click="showDialogRestore(action.row.id)" />
                    </q-td>
                </template>
            </q-table>

            <!--button reload-->
            <q-btn class="q-mx-lg" v-if="errorTable" label="Retry" @click="reOnRequest" color="secondary"></q-btn>
            <q-btn class="q-mx-lg" v-if="errorFilter" label="Retry" @click="filterSearch" color="secondary"></q-btn>

            <!--dialog add-->
            <q-dialog v-model="openDialogAdd" persistent>
                <q-card style="min-width: 350px; width: 1400px">
                    <q-card-section>
                        <div class="text-h6">Tambah Perusahaan</div>
                    </q-card-section>

                    <form @submit.prevent="submitFormAdd">
                        <q-card-section class="q-pt-none">
                            <q-input autofocus bottom-slots v-model="companyToAdd.name" label="Nama" label-color="grey-8"
                                color="black" ref="name" :rules="[val => !!val || 'Nama is required']">
                                <template v-slot:before>
                                    <q-icon name="comment" />
                                </template>
                                <template v-slot:append>
                                    <q-icon name="close" @click="companyToAdd.name = ''" class="cursor-pointer"
                                        v-if="companyToAdd.name" />
                                </template>
                            </q-input>
                            <q-select ref="province" use-input fill-input hide-selected bottom-slots
                                v-model="companyToAdd.province" label="Kode Provinsi" label-color="grey-8" color="secondary"
                                :options="provincePick" use-chips stack-label
                                :rules="[val => val !== null || 'Pilih satu provinsi']" @filter="filterProvince"
                                input-debounce="0" @update:model-value="refetchCities()">
                                <template v-slot:before>
                                    <q-icon name="house" />
                                </template>
                                <template v-slot:hint>
                                    Pilih satu provinsi
                                </template>
                            </q-select>
                            <q-select v-if="companyToAdd.province === ''" disable use-input fill-input hide-selected
                                bottom-slots v-model="companyToAdd.city" label="Kode Kota/Kabupaten" label-color="grey-8"
                                color="secondary" use-chips stack-label
                                :rules="[val => val !== null || 'Pilih provinsi terlebih dahulu']">
                                <template v-slot:before>
                                    <q-icon name="home" />
                                </template>
                                <template v-slot:hint>
                                    Pilih provinsi terlebih dahulu
                                </template>
                            </q-select>
                            <q-select v-if="companyToAdd.province !== ''" ref="city" use-input fill-input hide-selected
                                bottom-slots v-model="companyToAdd.city" label="Kode Kota/Kabupaten" label-color="grey-8"
                                color="secondary" :options="cityPick" use-chips stack-label
                                :rules="[val => val !== null || 'Pilih satu kota/kabupaten']" @filter="filterCity"
                                input-debounce="0" :loading="loadingCityOptions">
                                <template v-slot:before>
                                    <q-icon name="home" />
                                </template>
                                <template v-slot:hint>
                                    Pilih satu kota/kabupaten
                                </template>
                            </q-select>
                            <q-select ref="type" bottom-slots v-model="companyToAdd.type" label="Jenis" label-color="grey-8"
                                color="secondary" :options="typeOptions"
                                :rules="[val => val !== null || 'Pilih satu jenis']">
                                <template v-slot:before>
                                    <q-icon name="checklist" />
                                </template>
                                <template v-slot:hint>
                                    Pilih satu jenis
                                </template>
                            </q-select>
                            <q-input bottom-slots v-model="companyToAdd.address" label="Alamat" label-color="grey-8"
                                color="black" ref="address" lazy-rules :rules="[val => !!val || 'Alamat is required']">
                                <template v-slot:before>
                                    <q-icon name="contact_mail" />
                                </template>
                                <template v-slot:append>
                                    <q-icon name="close" @click="companyToAdd.address = ''" class="cursor-pointer"
                                        v-if="companyToAdd.address" />
                                </template>
                            </q-input>

                        </q-card-section>

                        <q-card-actions class="q-pa-md">
                            <q-btn label="Tambah" color="secondary" type="submit" />
                            <q-btn label="Batal" color="grey-8" v-close-popup />
                        </q-card-actions>
                    </form>
                    <q-inner-loading :showing="loadingAPI" label="Tunggu sebentar..." />
                </q-card>
            </q-dialog>

            <!--dialog edit-->
            <q-dialog v-model="openDialogEdit" persistent>
                <q-card style="min-width: 350px; width: 1400px">
                    <q-card-section>
                        <div class="text-h6">Ubah Perusahaan</div>
                    </q-card-section>

                    <form @submit.prevent="submitFormEdit">
                        <q-card-section class="q-pt-none">
                            <q-input autofocus bottom-slots v-model="companyToEdit.name" label="Nama" label-color="grey-8"
                                color="black" ref="name" :rules="[val => !!val || 'Nama is required']">
                                <template v-slot:before>
                                    <q-icon name="comment" />
                                </template>
                                <template v-slot:append>
                                    <q-icon name="close" @click="companyToEdit.name = ''" class="cursor-pointer"
                                        v-if="companyToEdit.name" />
                                </template>
                            </q-input>
                            <q-select ref="province" use-input fill-input hide-selected bottom-slots
                                v-model="companyToEdit.province" label="Kode Provinsi" label-color="grey-8"
                                color="secondary" :options="provincePick" use-chips stack-label
                                :rules="[val => val !== null || 'Pilih satu provinsi']" @filter="filterProvince"
                                input-debounce="0" @update:model-value="refetchCitiesEdit()">
                                <template v-slot:before>
                                    <q-icon name="house" />
                                </template>
                                <template v-slot:hint>
                                    Pilih satu provinsi
                                </template>
                            </q-select>
                            <q-select v-if="companyToEdit.province === ''" disable use-input fill-input hide-selected
                                bottom-slots v-model="companyToEdit.city" label="Kode Kota/Kabupaten" label-color="grey-8"
                                color="secondary" use-chips stack-label
                                :rules="[val => val !== null || 'Pilih provinsi terlebih dahulu']">
                                <template v-slot:before>
                                    <q-icon name="home" />
                                </template>
                                <template v-slot:hint>
                                    Pilih provinsi terlebih dahulu
                                </template>
                            </q-select>
                            <q-select v-if="companyToEdit.province !== ''" ref="city" use-input fill-input hide-selected
                                bottom-slots v-model="companyToEdit.city" label="Kode Kota/Kabupaten" label-color="grey-8"
                                color="secondary" :options="cityPick" use-chips stack-label
                                :rules="[val => val !== null || 'Pilih satu kota/kabupaten']" @filter="filterCity"
                                input-debounce="0" :loading="loadingCityOptions">
                                <template v-slot:before>
                                    <q-icon name="home" />
                                </template>
                                <template v-slot:hint>
                                    Pilih satu kota/kabupaten
                                </template>
                            </q-select>
                            <q-select ref="type" bottom-slots v-model="companyToEdit.type" label="Jenis"
                                label-color="grey-8" color="secondary" :options="typeOptions"
                                :rules="[val => val !== null || 'Pilih satu jenis']">
                                <template v-slot:before>
                                    <q-icon name="checklist" />
                                </template>
                                <template v-slot:hint>
                                    Pilih satu jenis
                                </template>
                            </q-select>
                            <q-input bottom-slots v-model="companyToEdit.address" label="Alamat" label-color="grey-8"
                                color="black" ref="address" lazy-rules :rules="[val => !!val || 'Alamat is required']">
                                <template v-slot:before>
                                    <q-icon name="contact_mail" />
                                </template>
                                <template v-slot:append>
                                    <q-icon name="close" @click="companyToEdit.address = ''" class="cursor-pointer"
                                        v-if="companyToEdit.address" />
                                </template>
                            </q-input>

                        </q-card-section>

                        <q-card-actions class="q-pa-md">
                            <q-btn label="Ubah" color="secondary" type="submit" />
                            <q-btn label="Batal" color="grey-8" v-close-popup />
                        </q-card-actions>
                    </form>
                    <q-inner-loading :showing="loadingAPI" label="Tunggu sebentar..." />
                </q-card>
            </q-dialog>

            <!--dialog details-->
            <q-dialog v-model="openDialogDetails" persistent>
                <q-card>
                    <q-card-section>
                        <div class="text-h6">Details</div>
                    </q-card-section>

                    <q-separator />

                    <q-card-section style="max-height: 50vh; min-width: 20vh" class="scroll">
                        <q-inner-loading :showing="companyDetails" label="Tunggu sebentar..." />
                        <p>{{ companyDetails }}</p>
                    </q-card-section>

                    <q-separator />

                    <q-card-actions align="right">
                        <q-btn label="OK" color="black" v-close-popup />
                    </q-card-actions>
                </q-card>
            </q-dialog>

            <!--dialog delete-->
            <q-dialog v-model="openDialogDelete" persistent>
                <q-card style="min-width: 350px">
                    <q-card-section>
                        <div class="text-h6">Konfirmasi</div>
                    </q-card-section>

                    <q-card-section>
                        <div class="text-p">Perusahaan akan dihapus. Apakah Anda yakin?</div>
                    </q-card-section>

                    <q-card-actions align="right">
                        <q-btn flat label="Batal" v-close-popup />
                        <q-btn color="black" autofocus label="Hapus" v-close-popup @click="deleteThisCompany()" />
                    </q-card-actions>
                </q-card>
            </q-dialog>

            <!--dialog restore-->
            <q-dialog v-model="openDialogRestore" persistent>
                <q-card style="min-width: 350px">
                    <q-card-section>
                        <div class="text-h6">Konfirmasi</div>
                    </q-card-section>

                    <q-card-section>
                        <div class="text-p">Perusahaan akan direstorasi. Apakah Anda yakin?</div>
                    </q-card-section>

                    <q-card-actions align="right">
                        <q-btn flat label="Batal" v-close-popup />
                        <q-btn color="black" autofocus label="Restorasi" v-close-popup @click="restoreThisCompany()" />
                    </q-card-actions>
                </q-card>
            </q-dialog>

            <!--button add-->
            <div class="fixed-bottom-right q-pa-lg">
                <q-btn @click="showDialogAdd()" round dense color="secondary" size="20px">
                    <q-icon name="add_business" size="24px" />
                </q-btn>
            </div>
        </q-page>
    </q-page>
</template>
    
<script>
import { defineComponent, ref } from 'vue'
import { useQuasar } from "quasar";
import { mapActions, mapGetters } from 'vuex'
import { fetchCompanies, fetchProvinces, fetchCities, fetchTypes, addCompany, fetchCompanyDetails, updateCompany, deleteCompany, restoreCompany } from '../services/companies-api'

export default defineComponent({
    setup() {
        const pagination = ref({
            page: 1,
            rowsPerPage: 10,
            rowsNumber: 10
        })

        const paramsCompanies = ref({
            keyword: "",
            kode_provinsi: null,
            kode_kab_kota: null,
            limit: pagination.value.rowsNumber,
            offset: 0
        })

        const paramsProvinces = ref({
            keyword: "",
            limit: null,
            offset: null
        })

        const paramsCities = ref({
            id_provinsi: null,
            keyword: "",
            limit: null,
            offset: null
        })

        const companyToAdd = ref({
            name: "",
            province: "",
            city: "",
            type: "",
            address: "",
            id_province: null,
            id_city: null
        })

        const companyToEdit = ref({
            name: "",
            province: "",
            city: "",
            type: "",
            address: "",
            id_province: null,
            id_city: null
        })

        const $q = useQuasar()

        return {
            paramsCompanies,
            paramsProvinces,
            paramsCities,
            pagination,
            companyToAdd,
            companyToEdit,
            selectedRow: ref(null),
            openDialogAdd: ref(false),
            openDialogEdit: ref(false),
            openDialogDetails: ref(false),
            openDialogDelete: ref(false),
            openDialogRestore: ref(false),
            provinceOptions: ref([]),
            provincePick: ref([]),
            cityOptions: ref([]),
            cityPick: ref([]),
            typeOptions: ref([]),
            companies: ref([]),
            provinces: ref([]),
            cities: ref([]),
            types: ref([]),
            companyDetails: ref(''),
            search: ref(''),
            filterTypes: ref([]),
            filterProvinces: ref([]),
            filterCities: ref([]),
            loadingMount: ref(true),
            loadingCityOptions: ref(true),
            loadingTable: ref(true),
            loadingAPI: ref(false),
            errorTable: ref(false),
            errorFilter: ref(false),
            notif: () => void 0,
            showNotif(message) {
                this.notif = $q.notify({
                    type: 'ongoing',
                    message: message
                })
            },
            hideNotif(message) {
                this.notif({
                    type: 'positive',
                    message: message,
                    timeout: 1000
                })
            },
        }
    },
    computed: {
        // ...mapGetters('companies', ['companies', 'provinces', 'cities', 'types', 'companyDetails'])
    },
    methods: {
        // ...mapActions('companies', ['fetchCompanies', 'fetchProvinces', 'fetchCities', 'fetchTypes', 'addCompany', 'fetchCompanyDetails', 'updateCompany', 'deleteCompany', 'restoreCompany']),
        onRequest(props) {
            const { page, rowsPerPage } = props.pagination

            // get all rows if "All" (0) is selected
            this.paramsCompanies.limit = rowsPerPage === 0 ? this.pagination.rowsNumber : rowsPerPage

            // calculate starting row of data
            this.paramsCompanies.offset = (page - 1) * rowsPerPage

            // fetch data from "server"
            this.companies = []
            this.loadingTable = true
            fetchCompanies(this.paramsCompanies)
                .then((res) => {
                    this.companies = res.data.data.result
                    this.loadingTable = false
                })
                .catch((err) => {
                    console.log(err)
                    this.loadingTable = false
                    this.errorTable = true
                })

            // update local pagination object
            this.pagination.rowsPerPage = rowsPerPage
            this.pagination.page = page
        },
        reOnRequest() {
            this.companies = []
            this.loadingTable = true
            fetchCompanies(this.paramsCompanies)
                .then((res) => {
                    this.companies = res.data.data.result
                    this.loadingTable = false
                    this.errorTable = false
                })
                .catch((err) => {
                    console.log(err)
                    this.loadingTable = false
                    this.errorTable = true
                })
            this.pagination.rowsPerPage = rowsPerPage
            this.pagination.page = page
        },
        filterProvince(val, update, abort) {
            update(() => {
                const search = val.toLowerCase()
                this.provincePick = this.provinceOptions.filter(v => v.toLowerCase().indexOf(search) > -1)
            })
        },
        filterCity(val, update, abort) {
            update(() => {
                const search = val.toLowerCase()
                this.cityPick = this.cityOptions.filter(v => v.toLowerCase().indexOf(search) > -1)
            })
        },
        showDialogAdd() {
            this.openDialogAdd = true
            this.resetFill()
        },
        showDialogEdit(id) {
            this.openDialogEdit = true
            this.selectedRow = id
            const index = this.companies.findIndex(a => a.id === id)
            // this.companyToEdit = { ...this.companies.result[index] }
            this.companyToEdit.name = this.companies[index].nama
            this.companyToEdit.province = this.companies[index].provinsi
            this.companyToEdit.city = this.companies[index].kab_kota
            this.companyToEdit.type = this.companies[index].jenis
            this.companyToEdit.address = this.companies[index].alamat
            this.companyToEdit.id_province = this.companies[index].kode_provinsi
            this.companyToEdit.id_city = this.companies[index].kode_kab_kota
            this.paramsCities.id_provinsi = this.companies[index].kode_provinsi
            this.fetchCitiesEdit()
        },
        showDialogDetails(id) {
            this.openDialogDetails = true
            this.selectedRow = id
            fetchCompanyDetails(this.selectedRow).then((res) => {
                this.companyDetails = res.data.data
            })
        },
        showDialogDelete(id) {
            this.openDialogDelete = true
            this.selectedRow = id
        },
        showDialogRestore(id) {
            this.openDialogRestore = true
            this.selectedRow = id
        },
        submitFormAdd() {
            this.$refs.name.validate()
            this.$refs.province.validate()
            this.$refs.city.validate()
            this.$refs.type.validate()
            this.$refs.address.validate()
            if (!this.$refs.name.hasError && !this.$refs.address.hasError && this.companyToAdd.province.length > 0 && this.companyToAdd.city.length > 0 && this.companyToAdd.type.length > 0) {
                this.addThisCompany()
            }
        },
        submitFormEdit() {
            this.$refs.name.validate()
            this.$refs.province.validate()
            this.$refs.city.validate()
            this.$refs.type.validate()
            this.$refs.address.validate()
            if (!this.$refs.name.hasError && !this.$refs.address.hasError && this.companyToEdit.province !== null && this.companyToEdit.city !== null && this.companyToEdit.type !== null) {
                this.editThisCompany()
            }
        },
        addThisCompany() {
            this.showNotif('Data sedang di-upload...')
            this.loadingAPI = true
            const index = this.cities.findIndex(a => a.nama === this.companyToAdd.city)
            if (this.cities[index].id_kota_kabupaten !== null) {
                this.companyToAdd.id_city = this.cities[index].id_kota_kabupaten
            } else {
                this.companyToAdd.id_city = 0
            }
            addCompany({ ...this.companyToAdd }).then((res) => {
                fetchCompanies(this.paramsCompanies).then((res) => {
                    this.companies = res.data.data.result
                    this.pagination.rowsNumber = res.data.data.total_record
                    this.hideNotif('Data berhasil di-upload!')
                    this.loadingAPI = false
                    this.openDialogAdd = false
                })
            })
        },
        editThisCompany() {
            this.showNotif('Data sedang di-update...')
            this.loadingAPI = true
            const index = this.cities.findIndex(a => a.nama === this.companyToEdit.city)
            // ada perubahan
            if (index != -1) {
                if (this.cities[index].id_kota_kabupaten !== null) {
                    this.companyToEdit.id_city = this.cities[index].id_kota_kabupaten
                } else {
                    this.companyToEdit.id_city = 0
                }
            }
            // const index = this.cities.findIndex(a => a.id_kota_kabupaten === this.companyToEdit.id_city)
            // this.companyToEdit.id_city = this.cities[index].id_kota_kabupaten
            updateCompany({
                id: this.selectedRow,
                updates: this.companyToEdit
            }).then((res) => {
                fetchCompanies(this.paramsCompanies).then((res) => {
                    this.companies = res.data.data.result
                    this.hideNotif('Data berhasil di-update!')
                    this.loadingAPI = false
                    this.openDialogEdit = false
                })
            })
        },
        deleteThisCompany() {
            this.showNotif('Data sedang dihapus...')
            deleteCompany(this.selectedRow).then((res) => {
                fetchCompanies(this.paramsCompanies).then((res) => {
                    this.companies = res.data.data.result
                    this.hideNotif('Data berhasil dihapus!')
                })
            })
        },
        restoreThisCompany() {
            this.showNotif('Data sedang direstorasi...')
            restoreCompany(this.selectedRow).then((res) => {
                fetchCompanies(this.paramsCompanies).then((res) => {
                    this.companies = res.data.data.result
                    this.hideNotif('Data berhasil direstorasi!')
                })
            })
        },
        resetFill() {
            this.companyToAdd.name = ""
            this.companyToAdd.province = ""
            this.companyToAdd.city = ""
            this.companyToAdd.type = ""
            this.companyToAdd.address = ""
            this.companyToAdd.id_province = null
            this.companyToAdd.id_city = null
        },
        fetchCitiesEdit() {
            this.loadingCityOptions = true
            this.cityOptions = []
            fetchCities(this.paramsCities).then((res) => {
                this.cities = res.data.data.result
                this.cityOptions = this.cities.map(a => a.nama)
                this.cityPick = this.cityOptions
                this.loadingCityOptions = false
            })
        },
        refetchCitiesEdit() {
            this.companyToEdit.city = ""
            const index = this.provinces.findIndex(a => a.nama_provinsi === this.companyToEdit.province)
            this.paramsCities.id_provinsi = this.provinces[index].id_provinsi
            this.companyToEdit.id_province = this.provinces[index].id_provinsi
            this.loadingCityOptions = true
            this.cityOptions = []
            fetchCities(this.paramsCities).then((res) => {
                this.cities = res.data.data.result
                this.cityOptions = this.cities.map(a => a.nama)
                this.cityPick = this.cityOptions
                this.loadingCityOptions = false
            })
        },
        refetchCities() {
            this.companyToAdd.city = ""
            const index = this.provinces.findIndex(a => a.nama_provinsi === this.companyToAdd.province)
            this.paramsCities.id_provinsi = this.provinces[index].id_provinsi
            this.companyToAdd.id_province = this.provinces[index].id_provinsi
            this.loadingCityOptions = true
            this.cityOptions = []
            fetchCities(this.paramsCities).then((res) => {
                this.cities = res.data.data.result
                this.cityOptions = this.cities.map(a => a.nama)
                this.cityPick = this.cityOptions
                this.loadingCityOptions = false
            })
        },
        async fetchCitiesFilter() {
            this.loadingCityOptions = true
            this.cityOptions = []
            for (let i = 0; i < this.filterProvinces.length; i++) {
                const index = this.provinces.findIndex(a => a.nama_provinsi === this.filterProvinces[i])
                this.paramsCities.id_provinsi = this.provinces[index].id_provinsi
                await fetchCities(this.paramsCities).then((res) => {
                    this.cityOptions.push(...res.data.data.result.map(a => a.id_kota_kabupaten))
                })
            }
        },
        async fetchCompaniesFilter() {
            this.pagination.page = 1
            this.paramsCompanies.keyword = this.search
            this.paramsCompanies.kode_provinsi = null
            this.paramsCompanies.kode_kab_kota = null
            this.companies = []
            this.pagination.rowsNumber = 0
            if (this.filterCities.length === 0) {
                if (this.filterProvinces.length > 0) {
                    for (let i = 0; i < this.filterProvinces.length; i++) {
                        const index = this.provinces.findIndex(a => a.nama_provinsi === this.filterProvinces[i])
                        this.paramsCompanies.kode_provinsi = this.provinces[index].id_provinsi
                        await fetchCompanies(this.paramsCompanies).then((res) => {
                            this.companies.push(...res.data.data.result)
                            this.pagination.rowsNumber += res.data.data.total_record
                        })
                    }
                } else {
                    this.paramsCompanies.kode_provinsi = null
                    await fetchCompanies(this.paramsCompanies).then((res) => {
                        this.companies.push(...res.data.data.result)
                        this.pagination.rowsNumber += res.data.data.total_record
                    })
                }
            } else {
                if (this.filterProvinces.length > 0) {
                    for (let i = 0; i < this.filterCities.length; i++) {
                        this.paramsCompanies.kode_kab_kota = this.filterCities[i]
                        await fetchCompanies(this.paramsCompanies).then((res) => {
                            this.companies.push(...res.data.data.result)
                            this.pagination.rowsNumber += res.data.data.total_record
                        })
                    }
                } else {
                    this.paramsCompanies.kode_provinsi = null
                    await fetchCompanies(this.paramsCompanies).then((res) => {
                        this.companies.push(...res.data.data.result)
                        this.pagination.rowsNumber += res.data.data.total_record
                    })
                }
            }
        },
        filterSearch() {
            this.companies = []
            this.loadingTable = true
            this.filterFilter()
            .then((res) => {
                if (this.filterTypes.length > 0) {
                    let tempCompanies = []
                    for (let i = 0; i < this.filterTypes.length; i++) {
                        for (let j = 0; j < this.companies.length; j++) {
                            if (this.companies[j].jenis.toLowerCase() === this.filterTypes[i].toLowerCase()) {
                                tempCompanies.push(this.companies[j])
                            }
                        }
                    }
                    this.companies = tempCompanies
                }
                this.errorFilter = false
            })
            .catch((err) => {
                this.errorFilter = true
                this.loadingTable = false
                this.loadingCityOptions = false
            })
        },
        async filterFilter() {
            await this.fetchCitiesFilter().then((res) => {
                let tempOptions = this.filterCities
                for (let i = 0; i < tempOptions.length; i++) {
                    let found = false
                    for (let j = 0; j < this.cityOptions.length; j++) {
                        if (this.cityOptions[j] === tempOptions[i]) {
                            found = true
                        }
                    }
                    if (!found) {
                        this.filterCities.splice(i, 1)
                    }
                }
                this.loadingCityOptions = false
            })
            await this.fetchCompaniesFilter().then((res) => {
                this.loadingTable = false
            })
        },
        async load() {
            await fetchCompanies(this.paramsCompanies).then((res) => {
                this.companies = res.data.data.result
                this.pagination.rowsNumber = res.data.data.total_record
            })
            await fetchProvinces(this.paramsProvinces).then((res) => {
                this.provinces = res.data.data.result
                this.provinceOptions = this.provinces.map(a => a.nama_provinsi)
                this.provincePick = this.provinceOptions
            })
            await fetchTypes().then((res) => {
                this.types = res.data.data
                this.typeOptions = res.data.data
            })
        }
    },
    mounted() {
        this.load()
            .then((res) => {
                this.loadingTable = false
            })
            .catch((err) => {
                console.log(err)
            })
    },
})
</script>
    
<style>
.item-color {
    background-color: white;
}

.page-header {
    font-size: 32px;
    line-height: 1.0;
}
</style>