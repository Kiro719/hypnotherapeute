# Guide de Mise en Production - Hypnothérapie App

## 🚀 Étapes de Déploiement

### 1. **Préparation de l'environnement**

#### A. Serveur de production
```bash
# Ubuntu/Debian
sudo apt update
sudo apt install nginx postgresql nodejs npm certbot

# Configuration du serveur
sudo ufw enable
sudo ufw allow 22    # SSH
sudo ufw allow 80    # HTTP
sudo ufw allow 443   # HTTPS
```

#### B. Base de données PostgreSQL
```bash
# Création de la base de données
sudo -u postgres psql
CREATE DATABASE hypnotherapie_prod;
CREATE USER hypnotherapie_user WITH PASSWORD 'mot_de_passe_securise';
GRANT ALL PRIVILEGES ON DATABASE hypnotherapie_prod TO hypnotherapie_user;
```

### 2. **Configuration des variables d'environnement**

```bash
# Copier le fichier d'exemple
cp env.production.example .env.production

# Éditer avec vos vraies valeurs
nano .env.production
```

### 3. **Configuration SSL/HTTPS**

#### A. Let's Encrypt (Gratuit)
```bash
# Installation
sudo apt install certbot python3-certbot-nginx

# Génération du certificat
sudo certbot --nginx -d votredomaine.com -d www.votredomaine.com

# Renouvellement automatique
sudo crontab -e
# Ajouter: 0 12 * * * /usr/bin/certbot renew --quiet
```

#### B. Configuration Nginx
```nginx
server {
    listen 80;
    server_name votredomaine.com www.votredomaine.com;
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name votredomaine.com www.votredomaine.com;

    ssl_certificate /etc/letsencrypt/live/votredomaine.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/votredomaine.com/privkey.pem;

    # Configuration SSL sécurisée
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers ECDHE-RSA-AES256-GCM-SHA512:DHE-RSA-AES256-GCM-SHA512;
    ssl_prefer_server_ciphers off;
    ssl_session_cache shared:SSL:10m;

    # Headers de sécurité
    add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;
    add_header X-Frame-Options DENY;
    add_header X-Content-Type-Options nosniff;
    add_header X-XSS-Protection "1; mode=block";

    # Proxy vers l'application Node.js
    location / {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }

    # Gestion des fichiers statiques
    location /static {
        alias /var/www/hypnotherapie/dist;
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
}
```

### 4. **Configuration Stripe en Production**

#### A. Création du compte Stripe
1. Créer un compte sur [stripe.com](https://stripe.com)
2. Activer le mode live
3. Récupérer les clés de production

#### B. Configuration des webhooks
```bash
# URL du webhook: https://votredomaine.com/api/payment/stripe-webhook
# Événements à écouter:
# - payment_intent.succeeded
# - payment_intent.payment_failed
# - payment_intent.canceled
```

#### C. Test des paiements
```bash
# Cartes de test Stripe
# Succès: 4242424242424242
# Échec: 4000000000000002
# 3D Secure: 4000002500003155
```

### 5. **Configuration Email**

#### A. Gmail avec mot de passe d'application
```bash
# 1. Activer la validation en 2 étapes
# 2. Générer un mot de passe d'application
# 3. Utiliser ce mot de passe dans EMAIL_APP_PASSWORD
```

#### B. SendGrid (Alternative recommandée)
```bash
# 1. Créer un compte SendGrid
# 2. Vérifier le domaine d'envoi
# 3. Configurer l'authentification DKIM
# 4. Utiliser l'API key dans SENDGRID_API_KEY
```

### 6. **Déploiement de l'application**

#### A. Build et déploiement
```bash
# Cloner le repository
git clone https://github.com/votre-username/hypnotherapie-app.git
cd hypnotherapie-app

# Installation des dépendances
npm ci --production

# Build de l'application
npm run build

# Démarrage avec PM2
npm install -g pm2
pm2 start ecosystem.config.js
pm2 save
pm2 startup
```

#### B. Configuration PM2
```javascript
// ecosystem.config.js
module.exports = {
  apps: [{
    name: 'hypnotherapie-app',
    script: 'server/index.js',
    instances: 2,
    exec_mode: 'cluster',
    env: {
      NODE_ENV: 'production',
      PORT: 5000
    },
    error_file: '/var/log/pm2/hypnotherapie-app-error.log',
    out_file: '/var/log/pm2/hypnotherapie-app-out.log',
    log_file: '/var/log/pm2/hypnotherapie-app.log',
    time: true
  }]
};
```

### 7. **Monitoring et Logs**

#### A. Configuration des logs
```bash
# Rotation des logs
sudo nano /etc/logrotate.d/hypnotherapie-app

# Contenu:
/var/log/pm2/hypnotherapie-app*.log {
    daily
    rotate 30
    compress
    delaycompress
    missingok
    notifempty
    create 644 root root
}
```

#### B. Monitoring avec Sentry
```bash
# Installation
npm install @sentry/node @sentry/integrations

# Configuration dans server/index.ts
import * as Sentry from '@sentry/node';

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  environment: process.env.NODE_ENV,
});
```

### 8. **Sauvegarde et Récupération**

#### A. Sauvegarde de la base de données
```bash
#!/bin/bash
# backup-db.sh

DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_FILE="backup_${DATE}.sql"
S3_BUCKET="votre-bucket-s3"

# Sauvegarde
pg_dump $DATABASE_URL > $BACKUP_FILE

# Compression
gzip $BACKUP_FILE

# Upload vers S3
aws s3 cp "${BACKUP_FILE}.gz" s3://$S3_BUCKET/backups/

# Nettoyage
rm "${BACKUP_FILE}.gz"

# Ajouter au cron pour exécution quotidienne
# 0 2 * * * /path/to/backup-db.sh
```

#### B. Sauvegarde des fichiers
```bash
#!/bin/bash
# backup-files.sh

DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_FILE="files_backup_${DATE}.tar.gz"
S3_BUCKET="votre-bucket-s3"

# Compression des fichiers
tar -czf $BACKUP_FILE /var/www/hypnotherapie/uploads/

# Upload vers S3
aws s3 cp $BACKUP_FILE s3://$S3_BUCKET/files-backups/

# Nettoyage
rm $BACKUP_FILE
```

### 9. **Tests de Production**

#### A. Tests de sécurité
```bash
# Test SSL
curl -I https://votredomaine.com

# Test des headers de sécurité
curl -I https://votredomaine.com | grep -i "x-frame-options\|x-content-type-options\|strict-transport-security"

# Test des paiements
# Utiliser les cartes de test Stripe
```

#### B. Tests de performance
```bash
# Test de charge avec Apache Bench
ab -n 1000 -c 10 https://votredomaine.com/

# Test de charge avec Artillery
npm install -g artillery
artillery quick --count 100 --num 10 https://votredomaine.com/
```

### 10. **Maintenance et Mises à Jour**

#### A. Mise à jour de l'application
```bash
#!/bin/bash
# update-app.sh

# Sauvegarde avant mise à jour
./scripts/backup-db.sh

# Pull des dernières modifications
git pull origin main

# Installation des nouvelles dépendances
npm ci --production

# Build
npm run build

# Redémarrage de l'application
pm2 restart hypnotherapie-app

# Vérification
pm2 status
```

#### B. Monitoring quotidien
```bash
# Vérification de l'état de l'application
pm2 status
pm2 logs --lines 100

# Vérification de l'espace disque
df -h

# Vérification de la mémoire
free -h

# Vérification des logs d'erreur
tail -f /var/log/pm2/hypnotherapie-app-error.log
```

## 🚨 Procédures d'Urgence

### En cas de problème de sécurité
1. Changer immédiatement tous les mots de passe
2. Révoquer les tokens JWT
3. Analyser les logs
4. Notifier les utilisateurs si nécessaire

### En cas de panne de l'application
1. Vérifier l'état des services: `pm2 status`
2. Consulter les logs: `pm2 logs`
3. Redémarrer si nécessaire: `pm2 restart hypnotherapie-app`
4. Restaurer depuis la sauvegarde si nécessaire

### En cas de problème de paiement
1. Vérifier les webhooks Stripe
2. Consulter les logs de paiement
3. Contacter le support Stripe si nécessaire

## 📞 Support et Contacts

- **Stripe Support**: https://support.stripe.com
- **SendGrid Support**: https://support.sendgrid.com
- **Let's Encrypt**: https://letsencrypt.org/docs
- **PM2 Documentation**: https://pm2.keymetrics.io/docs








