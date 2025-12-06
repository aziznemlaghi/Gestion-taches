import axios from 'axios';

const API_URL = 'http://localhost:3000/api/tasks';

export default {
  async getAllTasks() {
    try {
      const response = await axios.get(API_URL);
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la récupération des tâches:', error);
      throw error;
    }
  },

  async createTask(taskText) {
    try {
      const response = await axios.post(API_URL, { text: taskText });
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la création de la tâche:', error);
      throw error;
    }
  },

  async updateTask(id, updates) {
    try {
      const response = await axios.put(`${API_URL}/${id}`, updates);
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la mise à jour de la tâche:', error);
      throw error;
    }
  },

  async deleteTask(id) {
    try {
      const response = await axios.delete(`${API_URL}/${id}`);
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la suppression de la tâche:', error);
      throw error;
    }
  }
};