<template>
    <q-page class="row justify-center items-center">
        <div class="column q-pa-lg">
            <q-card square class="shadow-8" style="width:360px;height:360px;">
                <q-card-section class="bg-grey-4 text-center">
                    <q-img class="" :src="'https://jaga.id/datachallenge/img/logojaga.png'" spinner-color="white"
                        style="max-height: 64px; width: 128px" />
                </q-card-section>
                <q-card-section class="q-ma-none q-pa-none items-center text-center justify-center">
                    <q-card-section>
                        <q-form class="q-px-sm">
                            <q-input square clearable v-model="email" type="email" label="Email" color="black">
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
                        <q-btn unelevated size="lg" color="secondary" class="full-width text-white" label="Log In" />
                    </q-card-actions>
                    <q-card-section class="text-center">
                        <p class="text-grey-6">Forgot your password?</p>
                    </q-card-section>
                </q-card-section>
            </q-card>
        </div>
    </q-page>
</template>
  
<script>
export default {
    data() {
        return {
            email: '',
            password: ''
        }
    }
}
</script>
  
<style>
.item-color {
    background-color: white;
}
</style>