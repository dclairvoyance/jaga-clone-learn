<template>
    <q-page class="page-color q-px-lg q-py-md">
      <q-page class="item-color shadow-6">
        <div class="row text-h1 q-px-lg text-weight-bold page-header">
            Users Management
        </div>
        <q-separator />
        <q-table
            class="q-ma-lg"
            bordered
            :rows="users"
            :columns="[
                {
                    label: 'ID',
                    field: 'id',
                    name: 'id',
                    required: true,
                    sortable: true,
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
                    name: '',
                },
            ]"/>
      </q-page>
    </q-page>
  </template>
  
  <script>
  import { defineComponent } from 'vue'
  
  export default defineComponent({
    data () {
      return {
        users: [
          {
            id: 1,
            avatar: "link",
            username: "username1",
            name: "nama",
            email: "email",
            role: "role",
            active: false
          },
          {
            id: 2,
            avatar: "link",
            username: "username2",
            name: "nama",
            email: "email",
            role: "role",
            active: false
          }
        ]
      }
    }
  })
  </script>
  
  <style>
      .item-color {
        background-color: white;
      }

      .page-header {
        font-size: 40px;
      }
  </style>