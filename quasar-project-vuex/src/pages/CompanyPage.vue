<template>
    <q-page class="page-color q-px-lg q-py-md">
        <q-page class="item-color shadow-6">
            <div class="row text-h1 q-px-lg q-py-lg text-weight-bold page-header">
                Companies Management
            </div>
            <q-separator />
            <q-table class="q-ma-lg" bordered row-key="id" v-model:pagination="pagination" @request="onRequest"
                :rows="companies.result" :columns="[
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
                    <q-input borderless dense debounce="300" placeholder="Search">
                        <template v-slot:append>
                            <q-icon name="search" />
                        </template>
                    </q-input>
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
                                :rules="[val => val.length > 0 || 'Pilih satu provinsi']" @filter="filterProvince"
                                input-debounce="0" @update:model-value="refetchCities()">
                                <template v-slot:before>
                                    <q-icon name="house" />
                                </template>
                                <template v-slot:hint>
                                    Pilih satu provinsi
                                </template>
                            </q-select>
                            <q-select ref="city" use-input fill-input hide-selected bottom-slots v-model="companyToAdd.city"
                                label="Kode Kota/Kabupaten" label-color="grey-8" color="secondary" :options="cityPick"
                                use-chips stack-label :rules="[val => val.length > 0 || 'Pilih satu kota/kabupaten']"
                                @filter="filterCity" input-debounce="0">
                                <template v-slot:before>
                                    <q-icon name="home" />
                                </template>
                                <template v-slot:hint>
                                    Pilih satu kota/kabupaten
                                </template>
                            </q-select>
                            <q-select ref="type" bottom-slots v-model="companyToAdd.type" label="Jenis" label-color="grey-8"
                                color="secondary" :options="typeOptions"
                                :rules="[val => val.length > 0 || 'Pilih satu jenis']">
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
                            <q-select ref="city" use-input fill-input hide-selected bottom-slots
                                v-model="companyToEdit.city" label="Kode Kota/Kabupaten" label-color="grey-8"
                                color="secondary" :options="cityPick" use-chips stack-label
                                :rules="[val => val !== null || 'Pilih satu kota/kabupaten']" @filter="filterCity"
                                input-debounce="0">
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
                </q-card>
            </q-dialog>

            <!--dialog details-->
            <q-dialog v-model="openDialogDetails" persistent>
                <q-card>
                    <q-card-section>
                        <div class="text-h6">Details</div>
                    </q-card-section>

                    <q-separator />

                    <q-card-section style="max-height: 50vh" class="scroll">
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
import { mapActions, mapGetters } from 'vuex'

export default defineComponent({
    setup() {
        const pagination = ref({
            page: 1,
            rowsPerPage: 5,
            rowsNumber: 5
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
            typeOptions: ref([])
        }
    },
    computed: {
        ...mapGetters('companies', ['companies', 'provinces', 'cities', 'types', 'companyDetails'])
    },
    methods: {
        ...mapActions('companies', ['fetchCompanies', 'fetchProvinces', 'fetchCities', 'fetchTypes', 'addCompany', 'fetchCompanyDetails', 'updateCompany', 'deleteCompany', 'restoreCompany']),
        onRequest(props) {
            const { page, rowsPerPage } = props.pagination

            // get all rows if "All" (0) is selected
            this.paramsCompanies.limit = rowsPerPage === 0 ? this.pagination.rowsNumber : rowsPerPage

            // calculate starting row of data
            this.paramsCompanies.offset = (page - 1) * rowsPerPage

            // fetch data from "server"
            this.fetchCompanies(this.paramsCompanies)

            // update local pagination object
            this.pagination.rowsPerPage = rowsPerPage
            this.pagination.page = page
        },
        requestProvinces() {
            this.fetchProvinces(this.paramsProvinces)
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
            const index = this.companies.result.findIndex(a => a.id === id)
            // this.companyToEdit = { ...this.companies.result[index] }
            this.companyToEdit.name = this.companies.result[index].nama
            this.companyToEdit.province = this.companies.result[index].provinsi
            this.companyToEdit.city = this.companies.result[index].kab_kota
            this.companyToEdit.type = this.companies.result[index].jenis
            this.companyToEdit.address = this.companies.result[index].alamat
            this.companyToEdit.id_province = this.companies.result[index].kode_provinsi
            this.companyToEdit.id_city = this.companies.result[index].kode_kab_kota
            this.paramsCities.id_provinsi = this.companies.result[index].kode_provinsi
            this.fetchCitiesEdit()
        },
        showDialogDetails(id) {
            this.openDialogDetails = true
            this.selectedRow = id
            this.fetchCompanyDetails(this.selectedRow)
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
                this.openDialogAdd = false
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
                this.openDialogEdit = false
            }
        },
        addThisCompany() {
            const index = this.cities.findIndex(a => a.nama === this.companyToAdd.city)
            this.companyToAdd.id_city = this.cities[index].id_kota_kabupaten
            this.addCompany({ ...this.companyToAdd }).then((res) => {
                this.fetchCompanies(this.paramsCompanies).then((res) => {
                    this.pagination.rowsNumber = this.companies.total_record
                })
            })
        },
        editThisCompany() {
            const index = this.cities.findIndex(a => a.nama === this.companyToEdit.city)
            this.companyToEdit.id_city = this.cities[index].id_kota_kabupaten
            this.updateCompany({
                id: this.selectedRow,
                updates: this.companyToEdit
            }).then((res) => {
                this.fetchCompanies(this.paramsCompanies)
            })
        },
        deleteThisCompany() {
            this.deleteCompany(this.selectedRow).then((res) => {
                this.fetchCompanies(this.paramsCompanies)
            })
        },
        restoreThisCompany() {
            this.restoreCompany(this.selectedRow).then((res) => {
                this.fetchCompanies(this.paramsCompanies)
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
            this.fetchCities(this.paramsCities).then((res) => {
                this.cityOptions = this.cities.map(a => a.nama)
                this.cityPick = this.cityOptions
            })
        },
        refetchCitiesEdit() {
            this.companyToEdit.city = ""
            const index = this.provinces.findIndex(a => a.nama_provinsi === this.companyToEdit.province)
            this.paramsCities.id_provinsi = this.provinces[index].id_provinsi
            this.companyToEdit.id_province = this.provinces[index].id_provinsi
            this.fetchCities(this.paramsCities).then((res) => {
                this.cityOptions = this.cities.map(a => a.nama)
                this.cityPick = this.cityOptions
            })
        },
        refetchCities() {
            this.companyToAdd.city = ""
            const index = this.provinces.findIndex(a => a.nama_provinsi === this.companyToAdd.province)
            this.paramsCities.id_provinsi = this.provinces[index].id_provinsi
            this.companyToAdd.id_province = this.provinces[index].id_provinsi
            this.fetchCities(this.paramsCities).then((res) => {
                this.cityOptions = this.cities.map(a => a.nama)
                this.cityPick = this.cityOptions
            })
        }
    },
    mounted() {
        this.fetchCompanies(this.paramsCompanies).then((res) => {
            this.pagination.rowsNumber = this.companies.total_record
        })
        this.fetchProvinces(this.paramsProvinces).then((res) => {
            this.provinceOptions = this.provinces.map(a => a.nama_provinsi)
            this.provincePick = this.provinceOptions
        })
        this.fetchTypes().then((res) => {
            this.typeOptions = this.types
        })
        // this.$store.dispatch("fetchCompanies")
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