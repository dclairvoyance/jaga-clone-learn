<template>
  <q-page class="q-px-lg q-py-md">
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
          field: 'roles',
          name: 'roles',
          required: true,
          sortable: true,
          align: 'left'
        },
        {
          label: 'Aksi',
          field: '',
          name: 'action',
          align: 'center'
        },
        {
          label: 'Aktivasi',
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
        <template v-slot:body-cell-roles="roles">
          <q-td :props="roles">
            <q-badge class="q-mr-xs" v-for="role in roles.row.roles" :key="role" :color="roleOptions[role].color"
              :label="role" />
          </q-td>
        </template>
        <template v-slot:body-cell-action="action">
          <q-td :props="action">
            <q-btn flat icon="edit" @click="showDialogUpdate(action.row.id)" />
            <q-btn flat icon="delete" @click="showDialogDelete(action.row.id)" />
          </q-td>
        </template>
        <template v-slot:body-cell-active="active">
          <q-td :props="active">
            <q-btn flat icon="close" v-if="active.row.active" @click="showDialogActivate(active.row.id)" />
            <q-btn flat icon="done" v-if="!active.row.active" @click="showDialogActivate(active.row.id)" />
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
            <q-input color="black" dense v-model="usernameFill" autofocus @keyup.enter="openDialogDelete = false" />
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
                  <q-icon name="close" @click="userToAdd.name = ''" class="cursor-pointer" v-if="userToAdd.name" />
                </template>
              </q-input>
              <q-input bottom-slots v-model="userToAdd.email" label="Email" label-color="grey-8" color="black" ref="email"
                lazy-rules :rules="[val => !!val || 'Email is required', isValidEmail]">
                <template v-slot:before>
                  <q-icon name="mail" />
                </template>
                <template v-slot:append>
                  <q-icon name="close" @click="userToAdd.email = ''" class="cursor-pointer" v-if="userToAdd.email" />
                </template>
              </q-input>
              <q-input bottom-slots label="Instansi" label-color="grey-8" color="black">
                <template v-slot:before>
                  <q-icon name="business_center" />
                </template>
              </q-input>
              <q-select ref="role" bottom-slots v-model="roles" label="Role" label-color="grey-8" color="secondary"
                multiple :options="Object.keys(roleOptions)" use-chips stack-label
                :rules="[val => val.length > 0 || 'Pilih satu Role atau lebih']">
                <template v-slot:before>
                  <q-icon name="work" />
                </template>
                <template v-slot:hint>
                  Pilih satu Role atau lebih
                </template>
              </q-select>
              <q-checkbox class="q-ml-lg q-mt-sm" v-model="pickGender" size="sm" label="Isi jenis kelamin?"
                color="grey-8" />
              <div class="q-ml-xl" v-if="pickGender">
                <q-radio v-model="gender" size="sm" val="male" label="Male" color="grey-8" />
                <q-radio v-model="gender" size="sm" val="female" label="Female" color="grey-8" />
                <q-btn class="q-ml-sm" flat color="secondary" @click="clearGender()">Clear</q-btn>
              </div>
            </q-card-section>

            <q-card-actions class="q-pa-md">
              <q-btn label="Tambah" color="secondary" type="submit" />
              <q-btn label="Batal" color="grey-8" v-close-popup />
            </q-card-actions>
          </form>
        </q-card>
      </q-dialog>

      <!--dialog update-->
      <q-dialog v-model="openDialogUpdate" persistent>
        <q-card style="min-width: 350px; width: 1400px">
          <q-card-section>
            <div class="text-h6">Ubah User</div>
          </q-card-section>

          <form @submit.prevent="submitFormUpdate">
            <q-card-section class="q-pt-none">
              <q-input disable bottom-slots v-model="userToEdit.username" label="Username" label-color="grey-8"
                color="black" ref="usernameEdit">
                <template v-slot:before>
                  <q-icon name="contacts" />
                </template>
              </q-input>
              <q-input autofocus bottom-slots v-model="userToEdit.name" label="Nama" label-color="grey-8" color="black"
                ref="nameEdit" :rules="[val => !!val || 'Name is required']">
                <template v-slot:before>
                  <q-icon name="comment" />
                </template>
                <template v-slot:append>
                  <q-icon name="close" @click="userToEdit.name = ''" class="cursor-pointer" v-if="userToEdit.name" />
                </template>
              </q-input>
              <q-input bottom-slots v-model="userToEdit.email" label="Email" label-color="grey-8" color="black"
                ref="emailEdit" lazy-rules :rules="[val => !!val || 'Email is required', isValidEmail]">
                <template v-slot:before>
                  <q-icon name="mail" />
                </template>
                <template v-slot:append>
                  <q-icon name="close" @click="userToEdit.email = ''" class="cursor-pointer" v-if="userToEdit.email" />
                </template>
              </q-input>
              <q-input bottom-slots label="Instansi" label-color="grey-8" color="black">
                <template v-slot:before>
                  <q-icon name="business_center" />
                </template>
              </q-input>
              <q-select ref="roleEdit" bottom-slots v-model="roles" label="Role" label-color="grey-8" color="secondary"
                multiple :options="Object.keys(roleOptions)" use-chips stack-label
                :rules="[val => val.length > 0 || 'Pilih satu Role atau lebih']">
                <template v-slot:before>
                  <q-icon name="work" />
                </template>
                <template v-slot:hint>
                  Pilih satu Role atau lebih
                </template>
              </q-select>
              <q-checkbox class="q-ml-lg q-mt-sm" v-model="pickGender" size="sm" label="Isi jenis kelamin?"
                color="grey-8" />
              <div class="q-ml-xl" v-if="pickGender">
                <q-radio v-model="gender" size="sm" val="male" label="Male" color="grey-8" />
                <q-radio v-model="gender" size="sm" val="female" label="Female" color="grey-8" />
                <q-btn class="q-ml-sm" flat color="secondary" @click="clearGender()">Clear</q-btn>
              </div>
            </q-card-section>

            <q-card-actions class="q-pa-md">
              <q-btn label="Ubah" color="secondary" type="submit" />
              <q-btn label="Batal" color="grey-8" v-close-popup />
            </q-card-actions>
          </form>
        </q-card>
      </q-dialog>

      <!--dialog activate/deactivate-->
      <q-dialog v-model="openDialogActivate" persistent>
        <q-card style="min-width: 350px">
          <q-card-section>
            <div class="text-h6">Konfirmasi</div>
          </q-card-section>

          <q-card-section>
            <div v-if="!this.userToEdit.active" class="text-p">User akan diaktivasi. Apakah Anda yakin?</div>
            <div v-if="this.userToEdit.active" class="text-p">User akan dideaktivasi. Apakah Anda yakin?</div>
          </q-card-section>

          <q-card-actions align="right">
            <q-btn flat label="Batal" v-close-popup />
            <q-btn color="black" v-if="!this.userToEdit.active" autofocus label="Aktivasi" v-close-popup
              @click="activateThisUser()" />
            <q-btn color="black" v-if="this.userToEdit.active" autofocus label="Deaktivasi" v-close-popup
              @click="deactivateThisUser()" />
          </q-card-actions>
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

export default defineComponent({
  data() {
    return {
      userToAdd: {
        username: "",
        name: "",
        email: "",
        roles: [],
        active: false,
        id: "", // TODO: auto-increment
        avatar: "https://jaga.id/datachallenge/img/logojaga.png",
        gender: ""
      },
      userToEdit: {
        username: "",
        name: "",
        email: "",
        roles: [],
        active: false,
        id: "",
        avatar: "",
        gender: ""
      }
    }
  },
  setup() {
    return {
      openDialogDelete: ref(false),
      openDialogAdd: ref(false),
      openDialogUpdate: ref(false),
      openDialogActivate: ref(false),
      usernameFill: ref(''),
      selectedRow: ref(''),
      roles: ref([]),
      roleOptions: {
        "pengguna": { color: 'purple' },
        "pegawai": { color: 'green' }
      },
      pickGender: ref(false),
      gender: ref('')
    }
  },
  computed: {
    users() {
      return this.$store.getters['users/users']
    }
  },
  methods: {
    ...mapActions('users', ['deleteUser', 'addUser', 'updateUser']),
    showDialogDelete(id) {
      this.openDialogDelete = true
      this.selectedRow = id
    },
    showDialogAdd() {
      this.openDialogAdd = true
      this.resetFill()
    },
    showDialogUpdate(id) {
      this.openDialogUpdate = true
      this.selectedRow = id
      this.userToEdit = { ...this.users[this.selectedRow] }
      this.roles = Object.values(this.userToEdit.roles)
      this.pickGender = this.userToEdit.gender == "male" || this.userToEdit.gender == "female"
      this.gender = this.userToEdit.gender
    },
    showDialogActivate(id) {
      this.openDialogActivate = true
      this.selectedRow = id
      this.userToEdit = { ...this.users[this.selectedRow] }
    },
    deleteThisUser() {
      this.deleteUser(this.selectedRow)
    },
    submitFormAdd() {
      this.$refs.username.validate()
      this.$refs.name.validate()
      this.$refs.email.validate()
      this.$refs.role.validate()
      if (!this.$refs.username.hasError && !this.$refs.name.hasError && !this.$refs.email.hasError && this.roles.length > 0) {
        this.addThisUser()
        this.openDialogAdd = false
      }
    },
    addThisUser() {
      if (this.pickGender) {
        this.userToAdd.gender = this.gender
      }
      this.userToAdd.roles = { ...this.roles }
      this.addUser({ ...this.userToAdd })
    },
    submitFormUpdate() {
      this.$refs.usernameEdit.validate()
      this.$refs.nameEdit.validate()
      this.$refs.emailEdit.validate()
      this.$refs.roleEdit.validate()
      if (!this.$refs.usernameEdit.hasError && !this.$refs.nameEdit.hasError && !this.$refs.emailEdit.hasError && this.roles.length > 0) {
        this.updateThisUser()
        this.openDialogUpdate = false
      }
    },
    updateThisUser() {
      if (this.pickGender) {
        this.userToEdit.gender = this.gender
      }
      else {
        this.userToEdit.gender = ''
      }
      this.userToEdit.roles = { ...this.roles }
      this.updateUser({
        id: this.selectedRow,
        updates: this.userToEdit
      })
    },
    activateThisUser() {
      this.userToEdit.active = !this.userToEdit.active
      this.updateUser({
        id: this.selectedRow,
        updates: this.userToEdit
      })
      this.openDialogActivate = false
    },
    deactivateThisUser() {
      this.activateThisUser()
    },
    resetFill() {
      this.pickGender = false
      this.gender = ""
      this.roles = []
      this.userToAdd.id = ""
      this.userToAdd.username = ""
      this.userToAdd.name = ""
      this.userToAdd.email = ""
      this.userToAdd.roles = ""
    },
    clearGender() {
      this.userToAdd.gender = ''
      this.userToEdit.gender = ''
    },
    isValidEmail() {
      const emailPattern = /^(?=[a-zA-Z0-9@._%+-]{6,254}$)[a-zA-Z0-9._%+-]{1,64}@(?:[a-zA-Z0-9-]{1,63}\.){1,8}[a-zA-Z]{2,63}$/
      return emailPattern.test(this.userToAdd.email) || 'Email invalid'
    },
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