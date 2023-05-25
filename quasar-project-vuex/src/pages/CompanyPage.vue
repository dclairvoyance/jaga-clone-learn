<template>
    <q-page class="page-color q-px-lg q-py-md">
      <q-page class="item-color shadow-6">
        <div class="row text-h1 q-px-lg q-py-lg text-weight-bold page-header">
          Companies Management
        </div>
        <q-separator />
        <q-table class="q-ma-lg" bordered row-key="id" :rows="companies" :columns="[
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
        ]">
        </q-table>
        {{ data }}
      </q-page>
    </q-page>
  </template>
    
  <script>
  import { defineComponent, ref } from 'vue'
  import { api } from 'boot/axios'
  import { useQuasar } from 'quasar'
  
  export default defineComponent({
    setup () {
        const $q = useQuasar()
        const data = ref(null)

        console.log("go")
        api.get('/v5/perusahaan')
            .then((response) => {
                data.value = response.data
            })
            .catch(() => {
                $q.notify({
                    color: 'negative',
                    position: 'top',
                    message: 'Loading failed',
                    icon: 'report_problem'
                })
            })
        return { data }
    },
    computed: {
      companies() {
        return this.$store.getters['companies/companies']
      }
    },
    methods: {
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