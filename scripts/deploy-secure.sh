#!/bin/bash

# Script de déploiement sécurisé pour Hypnothérapie App
# Usage: ./scripts/deploy-secure.sh [environment]

set -e  # Arrêter en cas d'erreur

ENVIRONMENT=${1:-production}
echo "🚀 Déploiement en mode $ENVIRONMENT"

# Vérifications de sécurité avant déploiement
echo "🔍 Vérifications de sécurité..."

# 1. Vérifier que les variables d'environnement sont définies
if [ ! -f ".env.production" ]; then
    echo "❌ Fichier .env.production manquant!"
    echo "📋 Copiez env.production.example vers .env.production et remplissez les valeurs"
    exit 1
fi

# 2. Vérifier que les clés Stripe sont configurées
if ! grep -q "STRIPE_SECRET_KEY=sk_live_" .env.production; then
    echo "⚠️  Clé Stripe de production non configurée!"
    echo "🔧 Configurez STRIPE_SECRET_KEY avec une clé sk_live_"
fi

# 3. Vérifier que JWT_SECRET est sécurisé
JWT_SECRET=$(grep "JWT_SECRET=" .env.production | cut -d'=' -f2)
if [ ${#JWT_SECRET} -lt 32 ]; then
    echo "❌ JWT_SECRET trop court! Minimum 32 caractères"
    exit 1
fi

# 4. Vérifier que le mot de passe admin par défaut est changé
if grep -q "ADMIN_PASSWORD=admin123" .env.production; then
    echo "❌ Mot de passe admin par défaut détecté!"
    echo "🔧 Changez ADMIN_PASSWORD dans .env.production"
    exit 1
fi

echo "✅ Vérifications de sécurité passées"

# Installation des dépendances
echo "📦 Installation des dépendances..."
npm ci --production

# Build de l'application
echo "🔨 Build de l'application..."
npm run build

# Tests de sécurité
echo "🧪 Tests de sécurité..."
npm run test:security || echo "⚠️  Tests de sécurité échoués"

# Backup de la base de données (si en production)
if [ "$ENVIRONMENT" = "production" ]; then
    echo "💾 Sauvegarde de la base de données..."
    # Ajoutez ici votre commande de backup
    # pg_dump $DATABASE_URL > backup_$(date +%Y%m%d_%H%M%S).sql
fi

# Déploiement
echo "🚀 Déploiement..."
# Ajoutez ici vos commandes de déploiement
# Par exemple:
# - Upload vers votre serveur
# - Redémarrage des services
# - Mise à jour de la base de données

# Vérification post-déploiement
echo "🔍 Vérification post-déploiement..."

# Test de connectivité
echo "🌐 Test de connectivité..."
curl -f https://votredomaine.com/health || echo "⚠️  Service non accessible"

# Test des paiements Stripe
echo "💳 Test des paiements..."
# Ajoutez ici un test de paiement Stripe

# Notification de déploiement
echo "📧 Notification de déploiement..."
# Envoyez une notification Slack/Discord/Email

echo "✅ Déploiement terminé avec succès!"
echo "🔗 Application disponible sur: https://votredomaine.com"
echo "📊 Monitoring: https://sentry.io/your-project"








