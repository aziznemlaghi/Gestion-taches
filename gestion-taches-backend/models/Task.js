const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
  text: {
    type: String,
    required: true,
    trim: true
  },
  completed: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true // Ajoute createdAt et updatedAt automatiquement
});

module.exports = mongoose.model('Task', taskSchema);