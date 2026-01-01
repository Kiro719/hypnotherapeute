# Instructions pour déployer le système d'authentification

## 🔧 **Étapes de mise en place**

### **1. Installation des dépendances**
```bash
npm install bcryptjs jsonwebtoken @types/bcryptjs @types/jsonwebtoken
```

### **2. Configuration de l'environnement**
Créer un fichier `.env` :
```env
# Clé secrète pour JWT (changez-la en production !)
JWT_SECRET=your-super-secret-key-change-in-production

# Configuration de la base de données
DATABASE_URL=postgresql://user:password@localhost:5432/hypnotherapie
```

### **3. Migration de la base de données**
```bash
# Ajouter les nouvelles tables à votre schéma existant
npx drizzle-kit generate
npx drizzle-kit migrate
```

### **4. Créer le premier administrateur**
```bash
# Exécuter le script de création d'admin
npx tsx server/create-admin.ts
```

### **5. Intégrer les routes d'authentification**
Dans votre `server/routes.ts` :
```typescript
import authRouter from './auth-routes';

// Ajouter les routes d'auth
app.use('/api/auth', authRouter);
```

### **6. Remplacer le système de démo**
Dans `client/src/lib/auth-system.ts`, remplacer le contenu par celui de `auth-system-real.ts`.

## 🛡️ **Sécurité**

### **Mots de passe**
- ✅ **Hachage** avec bcrypt (12 rounds)
- ✅ **Validation** côté serveur
- ✅ **Minimum 8 caractères**

### **Tokens JWT**
- ✅ **Expiration** après 7 jours
- ✅ **Vérification** côté serveur
- ✅ **Suppression** automatique si invalide

### **Rôles et permissions**
- ✅ **Vérification** côté serveur
- ✅ **Middleware** de protection
- ✅ **Accès** basé sur les rôles

## 🚀 **Fonctionnalités disponibles**

### **Pour les utilisateurs**
- ✅ **Inscription** libre (rôle client par défaut)
- ✅ **Connexion** sécurisée
- ✅ **Profil** utilisateur
- ✅ **Déconnexion**

### **Pour les admins**
- ✅ **Création** d'autres admins
- ✅ **Création** de thérapeutes
- ✅ **Gestion** des utilisateurs
- ✅ **Accès** complet au système

### **Pour les thérapeutes**
- ✅ **Gestion** des RDV
- ✅ **Gestion** des messages
- ✅ **Statistiques** limitées
- ❌ **Pas d'accès** à la configuration

## 🔄 **Migration depuis le système de démo**

### **Étapes**
1. **Sauvegarder** les données existantes
2. **Installer** les nouvelles dépendances
3. **Migrer** la base de données
4. **Remplacer** le système d'auth
5. **Tester** avec le premier admin
6. **Créer** les autres utilisateurs

### **Comptes de test**
- **Admin** : `admin@hypnotherapie.fr` / `admin123`
- **Thérapeute** : Créé par l'admin
- **Client** : Inscription libre

## ⚠️ **Important**

1. **Changez** le mot de passe admin par défaut
2. **Configurez** une clé JWT sécurisée
3. **Activez** HTTPS en production
4. **Sauvegardez** régulièrement la base de données
5. **Testez** toutes les fonctionnalités avant la mise en production







