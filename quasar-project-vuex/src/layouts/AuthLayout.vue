<template>
    <q-layout>
        <q-page-container class="page-color">
            <router-view />
        </q-page-container>
    </q-layout>
</template>
  
<script>
import { defineComponent, ref } from 'vue'

export default defineComponent({
    name: 'MainLayout',

    components: {
    },

    setup() {
    }
})
</script>
  
<style>
.color-button {
    color: black;
}

.page-color {
    background-color: #e8e8e8;
}
</style>