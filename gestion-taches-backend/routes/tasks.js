const express = require('express');
const router = express.Router();
const Task = require('../models/Task');

// GET - Récupérer toutes les tâches
router.get('/', async (req, res) => {
  try {
    const tasks = await Task.find().sort({ createdAt: -1 }); // Plus récentes en premier
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la récupération des tâches', error: error.message });
  }
});

// POST - Créer une nouvelle tâche
router.post('/', async (req, res) => {
  try {
    const { text, completed = false } = req.body;
    
    if (!text || text.trim() === '') {
      return res.status(400).json({ message: 'Le texte de la tâche est requis' });
    }

    const task = new Task({
      text: text.trim(),
      completed
    });

    const savedTask = await task.save();
    res.status(201).json(savedTask);
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la création de la tâche', error: error.message });
  }
});

// PUT - Mettre à jour une tâche
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { text, completed } = req.body;

    const task = await Task.findByIdAndUpdate(
      id,
      { text, completed },
      { new: true, runValidators: true }
    );

    if (!task) {
      return res.status(404).json({ message: 'Tâche non trouvée' });
    }

    res.json(task);
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la mise à jour de la tâche', error: error.message });
  }
});

// DELETE - Supprimer une tâche
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    const task = await Task.findByIdAndDelete(id);
    
    if (!task) {
      return res.status(404).json({ message: 'Tâche non trouvée' });
    }

    res.json({ message: 'Tâche supprimée avec succès' });
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la suppression de la tâche', error: error.message });
  }
});

module.exports = router;