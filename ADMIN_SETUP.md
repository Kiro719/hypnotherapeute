# 🔐 Configuration de l'Administrateur Principal

## 📧 Configuration de votre email admin

### **Étape 1 : Modifier votre email**
1. Ouvrez le fichier `server/config/admin.ts`
2. Remplacez `"votre.email@exemple.fr"` par votre vraie adresse email
3. Sauvegardez le fichier

### **Étape 2 : Redémarrer le serveur**
```bash
npm run dev
```

### **Étape 3 : Se connecter**
1. Allez sur `/connexion`
2. Utilisez votre email et le mot de passe `admin123`
3. Vous serez automatiquement redirigé vers `/admin`

### **Étape 4 : Sécuriser votre compte**
1. Dans le panneau admin, allez dans "Paramètres"
2. Changez immédiatement le mot de passe par défaut
3. Configurez les autres paramètres de sécurité

## 🔒 Sécurité recommandée

### **Mot de passe fort**
- Minimum 12 caractères
- Mélange de lettres, chiffres et symboles
- Évitez les mots du dictionnaire

### **Double authentification (optionnel)**
- Activez la 2FA si disponible
- Utilisez une application d'authentification

### **Sessions sécurisées**
- Déconnectez-vous après chaque session
- Ne partagez jamais vos identifiants
- Utilisez un navigateur privé si nécessaire

## 📱 Accès admin

### **URLs d'accès**
- **Connexion** : `/connexion`
- **Admin** : `/admin` (redirection automatique après connexion)

### **Fonctionnalités admin**
- ✅ Gestion des utilisateurs
- ✅ Configuration du site
- ✅ Gestion des rendez-vous
- ✅ Gestion des messages
- ✅ Gestion du blog
- ✅ Analytics et statistiques

## 🚨 Important

### **Première connexion**
1. **Changez immédiatement** le mot de passe par défaut
2. **Vérifiez** que votre email est correct
3. **Configurez** les paramètres de sécurité

### **En cas de problème**
- Vérifiez que l'email est correct dans `server/config/admin.ts`
- Redémarrez le serveur après modification
- Contactez le support si nécessaire

## 📋 Checklist de sécurité

- [ ] Email admin configuré
- [ ] Mot de passe changé
- [ ] Paramètres de sécurité configurés
- [ ] Sessions testées
- [ ] Accès admin vérifié
- [ ] Permissions vérifiées

---

**Note** : Gardez ce fichier de configuration sécurisé et ne le partagez jamais publiquement.










