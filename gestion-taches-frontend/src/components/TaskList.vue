<template>
  <ul class="task-list">
    <li 
      v-for="(task, index) in tasks" 
      :key="task.id" 
      :class="{ completed: task.completed }"
    >
      <input 
        type="checkbox" 
        v-model="task.completed" 
        @change="$emit('task-updated')"
      />
      <span>{{ task.text }}</span>
      <button @click="$emit('remove-task', index)">Supprimer</button>
    </li>
  </ul>
</template>

<script>
export default {
  name: 'TaskList',
  props: {
    tasks: {
      type: Array,
      required: true
    }
  }
};
</script>