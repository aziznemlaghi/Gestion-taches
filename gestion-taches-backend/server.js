const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Connexion MongoDB Atlas
const MONGODB_URI = process.env.MONGODB_URI;

console.log('🔍 Tentative de connexion à Atlas...');

if (!MONGODB_URI) {
  console.error('❌ MONGODB_URI n\'est pas définie dans le fichier .env');
  process.exit(1);
}

// Connexion simplifiée
mongoose.connect(MONGODB_URI)
.then(() => {
  console.log('✅ Connecté à votre cluster MongoDB Atlas !');
  console.log('📊 Base de données:', mongoose.connection.name);
  console.log('🌍 Host:', mongoose.connection.host);
})
.catch((err) => {
  console.error('❌ Erreur de connexion à MongoDB Atlas:', err.message);
});

// Routes
const taskRoutes = require('./routes/tasks');
app.use('/api/tasks', taskRoutes);

// Route de test
app.get('/', (req, res) => {
  res.json({ 
    message: 'API connectée à votre cluster Atlas !',
    cluster: 'cluster0.vlwuwi4.mongodb.net',
    database: mongoose.connection.name || 'Non connecté',
    status: 'OK',
    mongooseVersion: mongoose.version
  });
});

// Route de santé
app.get('/health', (req, res) => {
  const dbStatus = mongoose.connection.readyState;
  const statuses = {
    0: 'Déconnecté',
    1: 'Connecté',
    2: 'En cours de connexion',
    3: 'En cours de déconnexion'
  };
  
  res.json({
    status: 'API en ligne',
    database: statuses[dbStatus],
    mongooseVersion: mongoose.version,
    timestamp: new Date().toISOString()
  });
});

// Middleware de gestion d'erreurs
app.use((err, req, res, next) => {
  console.error('❌ Erreur serveur:', err);
  res.status(500).json({ 
    message: 'Erreur interne du serveur',
    error: process.env.NODE_ENV === 'development' ? err.message : 'Something went wrong'
  });
});

// ✅ Gestionnaire pour les routes non trouvées (corrigé)
app.use((req, res) => {
  res.status(404).json({ 
    message: 'Route non trouvée',
    path: req.originalUrl,
    method: req.method
  });
});

// Démarrer le serveur
app.listen(PORT, () => {
  console.log(`🚀 Serveur démarré sur http://localhost:${PORT}`);
  console.log(`📱 Environnement: ${process.env.NODE_ENV || 'development'}`);
  console.log(`📦 Mongoose version: ${mongoose.version}`);
});