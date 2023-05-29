<template>
    <q-page class="row justify-center items-center">
        <div class="column q-pa-lg">
            <q-card square class="shadow-8" style="width:360px;height:360px;">
                <q-card-section class="bg-grey-4 text-center">
                    <q-img class="" :src="'https://jaga.id/datachallenge/img/logojaga.png'" spinner-color="white"
                        style="max-height: 64px; width: 128px" />
                </q-card-section>
                <form @submit.prevent="submitLogin">
                    <q-card-section>
                        <q-form class="q-px-sm">
                            <q-input square clearable v-model="username" type="username" label="Username" color="black">
                                <template v-slot:prepend>
                                    <q-icon name="email" />
                                </template>
                            </q-input>
                            <q-input square clearable v-model="password" type="password" label="Password" color="black">
                                <template v-slot:prepend>
                                    <q-icon name="lock" />
                                </template>
                            </q-input>
                        </q-form>
                    </q-card-section>
                    <q-card-actions class="q-px-lg">
                        <q-btn type="submit" unelevated size="lg" color="secondary" class="full-width text-white" label="Log In" />
                    </q-card-actions>
                    <q-card-section class="text-center">
                        <p class="text-grey-6">Don't have an account? Register</p>
                    </q-card-section>
                </form>
            </q-card>
        </div>
    </q-page>
</template>
  
<script>
import { defineComponent } from 'vue'
import { mapActions } from 'vuex'

export default defineComponent({
    data() {
        return {
            username: '',
            password: ''
        }
    },
    computed: {
        isLoggedIn() {
            return this.$store.getters['user/user'].loggedIn
        }
    },
    created() {
        if (this.isLoggedIn) {
            this.$router.push('/')
        }
    },
    methods: {
        ...mapActions('user', ['login']),
        submitLogin() {
            this.login({username: this.username, password: this.password})
        }
    }
})
</script>
  
<style>
.item-color {
    background-color: white;
}
</style>