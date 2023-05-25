<template>
  <q-layout view="lHh Lpr lFf">
    <q-header class="color-button">
      <q-toolbar>
        <q-btn flat dense round icon="menu" aria-label="Menu" @click="toggleLeftDrawer" />

        <q-toolbar-title>

        </q-toolbar-title>

        <q-icon name="notifications" size="1.715em" class="margin-button" />
        <q-icon name="person" size="1.715em" class="margin-button" />
      </q-toolbar>
    </q-header>

    <q-drawer v-model="leftDrawerOpen" show-if-above bordered dark class="margin-drawer">
      <q-list dark>
        <q-item-label header>
          <q-img :src="'https://jaga.id/datachallenge/img/logojaga.png'" spinner-color="white"
            style="max-height: 64px; width: 128px" />
        </q-item-label>

        <EssentialLink v-for="link in essentialLinks" :key="link.title" v-bind="link" />
      </q-list>
    </q-drawer>

    <q-page-container class="page-color">
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script>
import { defineComponent, ref } from 'vue'
import EssentialLink from 'components/EssentialLink.vue'

const linksList = [
  {
    title: 'Dashboard',
    caption: 'Statistik dan Data',
    icon: 'dashboard',
    link: '/'
  },
  {
    title: 'Users',
    caption: 'User, Role, dan Akses',
    icon: 'person',
    link: '/users'
  },
  {
    title: 'Companies',
    caption: 'Perusahaan',
    icon: 'store',
    link: '/companies'
  }
]

export default defineComponent({
  name: 'MainLayout',

  components: {
    EssentialLink
  },

  setup() {
    const leftDrawerOpen = ref(false)

    return {
      essentialLinks: linksList,
      leftDrawerOpen,
      toggleLeftDrawer() {
        leftDrawerOpen.value = !leftDrawerOpen.value
      }
    }
  }
})
</script>

<style>
.margin-button {
  margin-left: 0.24em;
  margin-right: 0.24em;
}

.margin-drawer {
  padding-left: 0.64em;
}

.color-button {
  color: black;
}

.q-list--dark .q-item__label--header,
.q-item--dark .q-item__label--header {
  color: white;
}

.page-color {
  background-color: #e8e8e8;
}
</style>