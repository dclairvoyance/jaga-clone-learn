<template>
  <q-page class="page-color q-px-lg q-py-md">
    <q-list class="item-color shadow-6">
      <task
        v-for="(task) in tasks"
        :key="task.id"
        :task="task"></task>
    </q-list>
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
          dueTime: "18:30",
          completed: false
        },
        {
          id: 2,
          name: "Get bananas",
          dueDate: "2023/05/22",
          dueTime: "16:00",
          completed: false
        },
        {
          id: 3,
          name: "Get bananas",
          dueDate: "2023/05/22",
          dueTime: "16:00",
          completed: false
        },
        {
          id: 4,
          name: "Get bananas",
          dueDate: "2023/05/22",
          dueTime: "16:00",
          completed: false
        },
        {
          id: 5,
          name: "Get bananas",
          dueDate: "2023/05/22",
          dueTime: "16:00",
          completed: false
        },
        {
          id: 6,
          name: "Get bananas",
          dueDate: "2023/05/22",
          dueTime: "16:00",
          completed: false
        },
        {
          id: 7,
          name: "Get bananas",
          dueDate: "2023/05/22",
          dueTime: "16:00",
          completed: false
        },
        {
          id: 8,
          name: "Get bananas",
          dueDate: "2023/05/22",
          dueTime: "16:00",
          completed: false
        },
        {
          id: 9,
          name: "Get bananas",
          dueDate: "2023/05/22",
          dueTime: "16:00",
          completed: false
        },
        {
          id: 10,
          name: "Get bananas",
          dueDate: "2023/05/22",
          dueTime: "16:00",
          completed: false
        },
        {
          id: 11,
          name: "Get bananas",
          dueDate: "2023/05/22",
          dueTime: "16:00",
          completed: false
        },
        {
          id: 12,
          name: "Get bananas",
          dueDate: "2023/05/22",
          dueTime: "16:00",
          completed: false
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