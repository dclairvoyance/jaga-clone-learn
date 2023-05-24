<template>
  <q-page class="page-color q-px-lg q-py-md">
    <q-page class="item-color shadow-6">
      <div class="row text-h1 q-px-lg q-py-lg text-weight-bold page-header">
        Users Management
      </div>
      <q-separator />
      <q-table class="q-ma-lg" bordered row-key="id" :rows="Object.values(users)" :columns="[
        {
          label: 'ID',
          name: 'id',
          field: 'id',
          required: true,
          sortable: true,
          align: 'center'
        },
        {
          label: 'Avatar',
          name: 'avatar',
          field: 'avatar',
          required: true,
          align: 'center'
        },
        {
          label: 'Username',
          field: 'username',
          name: 'username',
          required: true,
          sortable: true,
          align: 'left'
        },
        {
          label: 'Nama',
          field: 'name',
          name: 'name',
          required: true,
          sortable: true,
          align: 'left'
        },
        {
          label: 'Email',
          field: 'email',
          name: 'email',
          required: true,
        },
        {
          label: 'Roles',
          field: 'role',
          name: 'role',
          required: true,
          sortable: true
        },
        {
          label: 'Aksi',
          field: '',
          name: 'action',
          align: 'center'
        },
        {
          label: 'Aktif?',
          field: '',
          name: 'active',
          align: 'center'
        }
      ]">

        <template v-slot:body-cell-avatar="avatar">
          <q-td :props="avatar">
            <q-img :src="avatar.row.avatar" spinner-color="white" />
          </q-td>
        </template>
        <template v-slot:body-cell-action="action">
          <q-td :props="action">
            <q-btn flat icon="edit" @click="showDialogDelete(action.row.id)" />
          </q-td>
        </template>
        <template v-slot:body-cell-active="active">
          <q-td :props="active">
            <q-btn flat icon="close" v-if="active.row.active" />
            <q-btn flat icon="done" v-if="!active.row.active" />
          </q-td>
        </template>
      </q-table>

      <!--dialog delete-->
      <q-dialog v-model="openDialogDelete" persistent>
        <q-card style="min-width: 350px">
          <q-card-section>
            <div class="text-h6">Konfirmasi</div>
          </q-card-section>

          <q-card-section>
            <div class="text-p">User akan dihapus. Apakah Anda yakin?</div>
          </q-card-section>

          <q-card-section class="q-pt-none">
            <div class="text-p">Tulis kembali username: "TODO: add username"</div>
            <q-input dense v-model="usernameFill" autofocus @keyup.enter="openDialogDelete = false" />
          </q-card-section>

          <q-card-actions align="right">
            <q-btn flat label="Batal" v-close-popup />
            <q-btn autofocus flat label="Hapus" v-close-popup @click="deleteThisUser()" />
          </q-card-actions>
        </q-card>
      </q-dialog>

      <!--dialog add-->
      <q-dialog v-model="openDialogAdd" persistent>
        <q-card style="min-width: 350px; width: 1400px">
          <q-card-section>
            <div class="text-h6">Tambah User</div>
          </q-card-section>

          <form @submit.prevent="submitFormAdd">
            <q-card-section class="q-pt-none">
              <q-input autofocus bottom-slots v-model="userToAdd.username" label="Username" label-color="grey-8"
                color="black" ref="username" :rules="[val => !!val || 'Username is required']">
                <template v-slot:before>
                  <q-icon name="contacts" />
                </template>
                <template v-slot:append>
                  <q-icon name="close" @click="userToAdd.username = ''" class="cursor-pointer"
                    v-if="userToAdd.username" />
                </template>
              </q-input>
              <q-input bottom-slots v-model="userToAdd.name" label="Nama" label-color="grey-8" color="black" ref="name"
                :rules="[val => !!val || 'Name is required']">
                <template v-slot:before>
                  <q-icon name="comment" />
                </template>
                <template v-slot:append>
                  <q-icon name="close" @click="userToAdd.name = ''" class="cursor-pointer"
                    v-if="userToAdd.name" />
                </template>
              </q-input>
              <q-input bottom-slots v-model="userToAdd.email" label="Email" label-color="grey-8" color="black" ref="email"
                :rules="[val => !!val || 'Email is required']">
                <template v-slot:before>
                  <q-icon name="mail" />
                </template>
                <template v-slot:append>
                  <q-icon name="close" @click="userToAdd.email = ''" class="cursor-pointer"
                    v-if="userToAdd.email" />
                </template>
              </q-input>
              <q-input bottom-slots label="Instansi" label-color="grey-8" color="black">
                <template v-slot:before>
                  <q-icon name="business_center" />
                </template>
              </q-input>
              <q-input bottom-slots v-model="userToAdd.role" label="Role" label-color="grey-8" color="black">
                <template v-slot:before>
                  <q-icon name="work" />
                </template>
                <template v-slot:hint>
                  Pilih satu Role atau lebih
                </template>
              </q-input>
            </q-card-section>

            <q-card-actions class="q-pa-md">
              <q-btn label="Tambah" color="secondary" type="submit" v-close-popup />
              <q-btn label="Batal" color="grey-8" v-close-popup />
            </q-card-actions>
          </form>
        </q-card>
      </q-dialog>

      <!--button add-->
      <div class="fixed-bottom-right q-pa-lg">
        <q-btn @click="showDialogAdd()" round dense color="secondary" size="20px">
          <q-icon name="person_add" size="24px" />
        </q-btn>
      </div>
    </q-page>
  </q-page>
</template>
  
<script>
import { defineComponent, ref } from 'vue'
import { mapActions, mapGetters } from 'vuex'
import { uid } from 'quasar'

export default defineComponent({
  data() {
    return {
      userToAdd: {
        username: "",
        name: "",
        email: "",
        role: "",
        active: false,
        id: "", // TODO: auto-increment
        avatar: "https://jaga.id/datachallenge/img/logojaga.png"
      }
    }
  },
  setup() {
    return {
      openDialogDelete: ref(false),
      openDialogAdd: ref(false),
      usernameFill: ref(''),
      selectedRow: ref('')
    }
  },
  computed: {
    users() {
      return this.$store.getters['users/users']
    }
  },
  methods: {
    ...mapActions('users', ['deleteUser', 'addUser']),
    showDialogDelete(id) {
      this.openDialogDelete = true
      this.selectedRow = id
    },
    showDialogAdd() {
      this.openDialogAdd = true
      this.resetFill()
      console.log(this.userToAdd)
    },
    deleteThisUser() {
      this.deleteUser(this.selectedRow)
    },
    submitFormAdd() {
      if (!this.$refs.username.hasError && !this.$refs.name.hasError && !this.$refs.hasError) {
        this.addThisUser()
      }
    },
    addThisUser() {
      // let userId = uid()
      // this.userToAdd.id = userId
      // let newUser = {
      //   id: userId,
      //   user: this.userToAdd
      // }
      this.addUser({...this.userToAdd})
    },
    resetFill() {
      this.userToAdd.id = ""
      this.userToAdd.username = ""
      this.userToAdd.name = ""
      this.userToAdd.email = ""
      this.userToAdd.role = ""
    }
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