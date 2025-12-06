<template>
  <div id="app">
    <h1>Gestion des Tâches (avec MongoDB)</h1>
    
    <div v-if="loading" class="loading">
      Chargement des tâches...
    </div>
    
    <div v-else>
      <div class="task-form">
        <input
          type="text"
          v-model="newTask"
          placeholder="Ajouter une nouvelle tâche"
          @keyup.enter="addTask"
          :disabled="addingTask"
        />
        <button @click="addTask" :disabled="!newTask.trim() || addingTask">
          {{ addingTask ? 'Ajout...' : 'Ajouter' }}
        </button>
      </div>
      
      <ul class="task-list" v-if="tasks.length > 0">
        <li v-for="task in tasks" :key="task._id" :class="{ completed: task.completed }">
          <input
            type="checkbox"
            :checked="task.completed"
            @change="toggleTask(task)"
          />
          <span>{{ task.text }}</span>
          <button @click="removeTask(task._id)" class="delete-btn">
            Supprimer
          </button>
        </li>
      </ul>
      
      <div v-else class="empty-state">
        <p>Aucune tâche pour le moment. Ajoutez-en une !</p>
      </div>
      
      <div class="stats" v-if="tasks.length > 0">
        <p>
          Tâches totales: <strong>{{ totalTasks }}</strong> | 
          Tâches terminées: <strong>{{ completedTasks }}</strong>
        </p>
      </div>
    </div>
    
    <div v-if="error" class="error">
      {{ error }}
    </div>
  </div>
</template>

<script>
import taskService from './services/taskService';

export default {
  name: 'App',
  data() {
    return {
      newTask: '',
      tasks: [],
      loading: true,
      addingTask: false,
      error: null
    };
  },
  computed: {
    totalTasks() {
      return this.tasks.length;
    },
    completedTasks() {
      return this.tasks.filter(task => task.completed).length;
    }
  },
  async created() {
    await this.loadTasks();
  },
  methods: {
    async loadTasks() {
      try {
        this.loading = true;
        this.error = null;
        this.tasks = await taskService.getAllTasks();
      } catch (error) {
        this.error = 'Impossible de charger les tâches. Vérifiez que le serveur backend fonctionne.';
        console.error('Erreur:', error);
      } finally {
        this.loading = false;
      }
    },
    
    async addTask() {
      if (!this.newTask.trim()) return;
      
      try {
        this.addingTask = true;
        this.error = null;
        const task = await taskService.createTask(this.newTask.trim());
        this.tasks.unshift(task); // Ajouter au début de la liste
        this.newTask = '';
      } catch (error) {
        this.error = 'Impossible d\'ajouter la tâche.';
        console.error('Erreur:', error);
      } finally {
        this.addingTask = false;
      }
    },
    
    async toggleTask(task) {
      try {
        this.error = null;
        const updatedTask = await taskService.updateTask(task._id, {
          completed: !task.completed,
          text: task.text
        });
        
        // Mettre à jour la tâche dans la liste locale
        const index = this.tasks.findIndex(t => t._id === task._id);
        if (index !== -1) {
          this.tasks.splice(index, 1, updatedTask);
        }
      } catch (error) {
        this.error = 'Impossible de mettre à jour la tâche.';
        console.error('Erreur:', error);
      }
    },
    
    async removeTask(id) {
      try {
        this.error = null;
        await taskService.deleteTask(id);
        this.tasks = this.tasks.filter(t => t._id !== id);
      } catch (error) {
        this.error = 'Impossible de supprimer la tâche.';
        console.error('Erreur:', error);
      }
    }
  }
};
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  text-align: center;
  margin: 20px;
  max-width: 600px;
  margin: 0 auto;
  padding: 20px;
}

.task-form {
  margin-bottom: 20px;
  display: flex;
  gap: 10px;
  justify-content: center;
}

.task-form input {
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
  flex: 1;
  max-width: 300px;
  font-size: 16px;
}

.task-form button {
  padding: 10px 20px;
  background-color: #4CAF50;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 16px;
}

.task-form button:hover:not(:disabled) {
  background-color: #45a049;
}

.task-form button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.task-list {
  list-style-type: none;
  padding: 0;
}

.task-list li {
  margin: 10px 0;
  padding: 15px;
  border: 1px solid #ddd;
  border-radius: 4px;
  display: flex;
  align-items: center;
  gap: 10px;
  justify-content: space-between;
  background: white;
}

.task-list li.completed span {
  text-decoration: line-through;
  color: #888;
}

.delete-btn {
  background-color: #f44336;
  color: white;
  border: none;
  padding: 5px 10px;
  border-radius: 3px;
  cursor: pointer;
}

.delete-btn:hover {
  background-color: #da190b;
}

.stats {
  margin-top: 20px;
  padding: 15px;
  background-color: #f5f5f5;
  border-radius: 4px;
}

.loading {
  text-align: center;
  padding: 20px;
  color: #666;
  font-style: italic;
}

.error {
  background-color: #ffebee;
  color: #c62828;
  padding: 10px;
  border-radius: 4px;
  margin: 10px 0;
}

.empty-state {
  text-align: center;
  color: #666;
  padding: 40px 20px;
}

.empty-state p {
  font-style: italic;
}
</style>