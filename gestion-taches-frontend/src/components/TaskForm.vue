<template>
  <div class="task-form">
    <input
      type="text"
      v-model="localTask"
      placeholder="Ajouter une nouvelle tâche"
      @keyup.enter="$emit('add-task', localTask)"
    />
    <button @click="$emit('add-task', localTask)">Ajouter</button>
  </div>
</template>

<script>
export default {
  name: 'TaskForm',
  data() {
    return {
      localTask: ''
    };
  },
  watch: {
    localTask(newVal) {
      if (!newVal) {
        this.$emit('task-cleared');
      }
    }
  }
};
</script>