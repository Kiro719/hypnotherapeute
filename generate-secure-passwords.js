// Script pour générer des mots de passe sécurisés
// Usage: node generate-secure-passwords.js

const crypto = require('crypto');

function generateSecurePassword(length = 16) {
  const charset = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*';
  let password = '';
  
  // S'assurer qu'on a au moins un caractère de chaque type
  password += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'[Math.floor(Math.random() * 26)]; // Majuscule
  password += 'abcdefghijklmnopqrstuvwxyz'[Math.floor(Math.random() * 26)]; // Minuscule
  password += '0123456789'[Math.floor(Math.random() * 10)]; // Chiffre
  password += '!@#$%^&*'[Math.floor(Math.random() * 8)]; // Symbole
  
  // Compléter avec des caractères aléatoires
  for (let i = 4; i < length; i++) {
    password += charset[Math.floor(Math.random() * charset.length)];
  }
  
  // Mélanger les caractères
  return password.split('').sort(() => Math.random() - 0.5).join('');
}

console.log('=== MOTS DE PASSE SÉCURISÉS GÉNÉRÉS ===');
console.log('Admin:', generateSecurePassword(20));
console.log('Thérapeute:', generateSecurePassword(20));
console.log('Client:', generateSecurePassword(20));
console.log('\n=== INSTRUCTIONS ===');
console.log('1. Copiez ces mots de passe');
console.log('2. Stockez-les dans un gestionnaire de mots de passe');
console.log('3. Remplacez les mots de passe par défaut dans le code');
console.log('4. Supprimez ce fichier après utilisation');
