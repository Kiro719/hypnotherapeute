// passenger_wsgi.js
// Fichier de démarrage pour Phusion Passenger (O2Switch)
// Ce fichier permet à Passenger de démarrer votre application Node.js

// Changer vers le répertoire de l'application
process.chdir(__dirname);

// Charger les variables d'environnement depuis .env si disponible
// (Passenger peut aussi les charger via le panel O2Switch)
try {
  if (process.env.NODE_ENV !== 'production' || !process.env.PASSENGER_APP_ENV) {
    // En développement ou si .env est disponible
    const fs = require('fs');
    const path = require('path');
    const envPath = path.join(__dirname, '.env');
    
    if (fs.existsSync(envPath)) {
      const envFile = fs.readFileSync(envPath, 'utf8');
      envFile.split('\n').forEach(line => {
        const match = line.match(/^([^#=]+)=(.*)$/);
        if (match) {
          const key = match[1].trim();
          const value = match[2].trim().replace(/^["']|["']$/g, '');
          if (!process.env[key]) {
            process.env[key] = value;
          }
        }
      });
    }
  }
} catch (error) {
  console.warn('Impossible de charger .env:', error.message);
}

// Forcer NODE_ENV en production si non défini
if (!process.env.NODE_ENV) {
  process.env.NODE_ENV = 'production';
}

// Démarrage de l'application
// Passenger exécutera ce fichier et votre application démarrera
try {
  require('./dist/index.js');
} catch (error) {
  console.error('Erreur lors du démarrage de l\'application:', error);
  process.exit(1);
}



