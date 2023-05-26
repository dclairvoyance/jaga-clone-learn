<template>
    <q-page class="page-color q-px-lg q-py-md">
        <q-page class="item-color shadow-6">
            <div class="row text-h1 q-px-lg q-py-lg text-weight-bold page-header">
                Companies Management
            </div>
            <q-separator />
            <q-table class="q-ma-lg" bordered row-key="id" v-model:pagination="pagination" @request="onRequest" :rows="companies.result" :columns="[
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
                        <q-btn flat icon="edit" @click="showDialogUpdate(action.row.id)" />
                        <q-btn flat icon="delete" @click="showDialogDelete(action.row.id)" />
                    </q-td>
                </template>
            </q-table>
        </q-page>
    </q-page>
</template>
    
<script>
import { defineComponent, onMounted, ref } from 'vue'
import { mapActions, mapGetters } from 'vuex'

export default defineComponent({
    setup() {
        const pagination = ref({
            page: 1,
            rowsPerPage: 5,
            rowsNumber: 5
        })

        const params = ref({
            keyword: "",
            kode_provinsi: null,
            kode_kab_kota: null,
            limit: pagination.value.rowsNumber,
            offset: 0
        })

        return {
            params,
            pagination
        }
    },
    computed: {
        ...mapGetters('companies', ['companies'])
    },
    methods: {
        ...mapActions('companies', ['fetchCompanies']),
        onRequest (props) {
            const { page, rowsPerPage } = props.pagination

            // get all rows if "All" (0) is selected
            this.params.limit = rowsPerPage === 0 ? this.pagination.rowsNumber : rowsPerPage

            // calculate starting row of data
            this.params.offset = (page - 1) * rowsPerPage

            // fetch data from "server"
            this.fetchCompanies(this.params)

            // update local pagination object
            this.pagination.rowsPerPage = rowsPerPage
            this.pagination.page = page
        }
    },
    mounted() {
        this.fetchCompanies(this.params).then((res) => {
            this.pagination.rowsNumber = this.companies.total_record
        })
        // this.$store.dispatch("fetchCompanies")
    }
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