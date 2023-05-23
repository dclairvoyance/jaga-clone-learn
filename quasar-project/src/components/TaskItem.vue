<template>
    <li>
        <p>{{ task.name }}</p>
        <p>{{ task.dueDate }} @{{ task.dueTime }} at {{ index }}</p>
    </li>
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