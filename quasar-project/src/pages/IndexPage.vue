<template>
  <q-page class="page-color q-px-lg q-py-sm">
    <ul class="item-color shadow-6">
      <task
        v-for="(task) in tasks"
        :key="task.id"
        :task="task"></task>
    </ul>
  </q-page>
</template>

<script>
import { defineComponent } from 'vue'

export default defineComponent({
  data () {
    return {
      tasks: [
        {
          id: 1,
          name: "Go to shops",
          dueDate: "2023/05/21",
          dueTime: "18:30"
        },
        {
          id: 2,
          name: "Get bananas",
          dueDate: "2023/05/22",
          dueTime: "16:00"
        },
        {
          id: 3,
          name: "Get bananas",
          dueDate: "2023/05/22",
          dueTime: "16:00"
        },
        {
          id: 4,
          name: "Get bananas",
          dueDate: "2023/05/22",
          dueTime: "16:00"
        },
        {
          id: 5,
          name: "Get bananas",
          dueDate: "2023/05/22",
          dueTime: "16:00"
        },
        {
          id: 6,
          name: "Get bananas",
          dueDate: "2023/05/22",
          dueTime: "16:00"
        },
        {
          id: 7,
          name: "Get bananas",
          dueDate: "2023/05/22",
          dueTime: "16:00"
        },
        {
          id: 8,
          name: "Get bananas",
          dueDate: "2023/05/22",
          dueTime: "16:00"
        },
        {
          id: 9,
          name: "Get bananas",
          dueDate: "2023/05/22",
          dueTime: "16:00"
        },
        {
          id: 10,
          name: "Get bananas",
          dueDate: "2023/05/22",
          dueTime: "16:00"
        },
        {
          id: 11,
          name: "Get bananas",
          dueDate: "2023/05/22",
          dueTime: "16:00"
        },
        {
          id: 12,
          name: "Get bananas",
          dueDate: "2023/05/22",
          dueTime: "16:00"
        }
      ]
    }
  },
  components: {
    'task': require('components/TaskItem.vue').default
  }
})
</script>

<style>
    .item-color {
        background-color: white;
    }
</style>