<template>
    <q-page class="row justify-center items-center">
        <div class="column q-pa-lg">
            <q-card square class="shadow-8" style="width:360px">
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
                    <q-card-section class="q-px-lg q-py-none q-ma-none" color="secondary">
                        <p class="text-red q-pa-none q-ma-none">{{ message }}</p>
                    </q-card-section>
                    <q-card-actions class="q-px-lg">
                        <q-btn type="submit" unelevated size="lg" color="secondary" class="full-width text-white"
                            label="Log In" />
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
import { mapActions, mapGetters } from 'vuex'
import { useRouter } from "vue-router";

export default defineComponent({
    setup() {
        const router = useRouter()
        return {
            redirect(path) {
                router.push({ path: path })
            },
        }
    },
    data() {
        return {
            username: '',
            password: ''
        }
    },
    computed: {
        ...mapGetters('user', ['message']),
        isLoggedIn() {
            return this.$store.getters['user/loggedIn']
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
            this.login({ username: this.username, password: this.password }).then((res) => {
                this.$router.push('/companies')
            })
        }
    }
})
</script>
  
<style>
.item-color {
    background-color: white;
}
</style>