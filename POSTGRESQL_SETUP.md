# Instructions pour installer PostgreSQL

## 🐘 **Installation de PostgreSQL**

### **Option 1 : Installation locale (Recommandée pour le développement)**

#### **Windows :**
1. Téléchargez PostgreSQL depuis : https://www.postgresql.org/download/windows/
2. Installez avec les paramètres par défaut
3. Notez le mot de passe du superutilisateur `postgres`
4. PostgreSQL sera accessible sur `localhost:5432`

#### **macOS :**
```bash
# Avec Homebrew
brew install postgresql
brew services start postgresql

# Ou avec Postgres.app
# Téléchargez depuis : https://postgresapp.com/
```

#### **Linux (Ubuntu/Debian) :**
```bash
sudo apt update
sudo apt install postgresql postgresql-contrib
sudo systemctl start postgresql
sudo systemctl enable postgresql
```

### **Option 2 : Base de données cloud (Recommandée pour la production)**

#### **Services recommandés :**
- **Supabase** (gratuit jusqu'à 500MB) : https://supabase.com
- **Railway** (gratuit avec limites) : https://railway.app
- **Neon** (gratuit jusqu'à 3GB) : https://neon.tech
- **ElephantSQL** (gratuit jusqu'à 20MB) : https://www.elephantsql.com

## 🔧 **Configuration après installation**

### **1. Créer la base de données**
```sql
-- Se connecter à PostgreSQL
psql -U postgres

-- Créer la base de données
CREATE DATABASE hypnotherapie;

-- Créer un utilisateur (optionnel)
CREATE USER hypnotherapie_user WITH PASSWORD 'votre_mot_de_passe';
GRANT ALL PRIVILEGES ON DATABASE hypnotherapie TO hypnotherapie_user;
```

### **2. Mettre à jour le fichier .env**
```env
# Pour installation locale
DATABASE_URL=postgresql://postgres:votre_mot_de_passe@localhost:5432/hypnotherapie

# Pour base de données cloud (exemple Supabase)
DATABASE_URL=postgresql://username:password@db.xxx.supabase.co:5432/postgres
```

### **3. Générer et exécuter les migrations**
```bash
# Générer les migrations
npx drizzle-kit generate

# Exécuter les migrations
npx drizzle-kit migrate
```

### **4. Créer le premier administrateur**
```bash
# Exécuter le script de création d'admin
npx tsx server/create-admin.ts
```

## 🚀 **Test de la connexion**

### **Vérifier que tout fonctionne :**
```bash
# Démarrer le serveur
npm run dev

# Tester la connexion à la base de données
# Le serveur devrait démarrer sans erreur
```

### **Tester l'authentification :**
1. Aller sur `/admin`
2. Se connecter avec :
   - Email : `admin@hypnotherapie.fr`
   - Mot de passe : `admin123`

## ⚠️ **Important**

1. **Changez** le mot de passe admin par défaut
2. **Configurez** une clé JWT sécurisée dans `.env`
3. **Sauvegardez** régulièrement la base de données
4. **Testez** toutes les fonctionnalités avant la mise en production

## 🔒 **Sécurité en production**

- Utilisez HTTPS
- Configurez un firewall
- Limitez l'accès à la base de données
- Utilisez des mots de passe forts
- Activez l'authentification à deux facteurs







