<template> 
    <q-item>
        <q-item-section>
            <q-item-label>{{ task.name }}</q-item-label>
        </q-item-section>
        <q-item-section side>
            <q-item-label>{{ task.dueDate }}</q-item-label>
            <q-item-label>@{{ task.dueTime }}</q-item-label>
        </q-item-section>
    </q-item>
    <q-separator></q-separator>
</template>

<script>
    import { defineComponent } from 'vue';

    export default defineComponent({
        name: 'TaskItem',
        props: ['task', 'index']
    })
</script>

<style>
</style>