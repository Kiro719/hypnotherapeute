# 🔐 Guide de Test des Rôles et Redirections

## 📧 Comptes de Test Disponibles

### **🔴 Administrateur**
- **Email** : `ninjaquentin22@gmail.com` (votre email configuré)
- **Mot de passe** : `admin123`
- **Redirection** : `/admin` (Panneau d'administration)
- **Fonctionnalités** : Accès complet + configuration

### **🟡 Thérapeute**
- **Email** : `therapist@hypnotherapie.fr`
- **Mot de passe** : `therapist123`
- **Redirection** : `/therapist-dashboard` (Tableau de bord thérapeute)
- **Fonctionnalités** : Gestion des clients + rendez-vous + messages

### **🟢 Client**
- **Email** : `client@hypnotherapie.fr`
- **Mot de passe** : `client123`
- **Redirection** : `/portail` (Portail client)
- **Fonctionnalités** : Accès à ses informations personnelles

## 🚀 Comment Tester

### **Étape 1 : Accéder à la connexion**
1. Allez sur `/connexion`
2. Vous verrez le formulaire de connexion unifié

### **Étape 2 : Se connecter avec différents rôles**
1. **Test Admin** : Utilisez `ninjaquentin22@gmail.com` / `admin123`
   - ✅ Redirection automatique vers `/admin`
   - ✅ Accès au panneau de configuration
   - ✅ Bouton "Admin" dans la navigation

2. **Test Thérapeute** : Utilisez `therapist@hypnotherapie.fr` / `therapist123`
   - ✅ Redirection automatique vers `/therapist-dashboard`
   - ✅ Accès à la gestion des clients
   - ✅ Bouton "Mes Clients" dans la navigation

3. **Test Client** : Utilisez `client@hypnotherapie.fr` / `client123`
   - ✅ Redirection automatique vers `/portail`
   - ✅ Accès au portail personnel
   - ✅ Bouton "Mon Portail" dans la navigation

### **Étape 3 : Vérifier la navigation**
Après connexion, vérifiez que les boutons de navigation correspondent au rôle :
- **Admin** : "Admin" + tous les autres boutons
- **Thérapeute** : "Mes Clients" + "Mon Portail" + "Admin"
- **Client** : "Mon Portail" + "Réserver"

## 🔄 Redirections Automatiques

### **Logique de redirection**
```javascript
switch (user.role) {
  case 'admin':
    setLocation('/admin');           // Panneau d'administration
    break;
  case 'therapist':
    setLocation('/therapist-dashboard'); // Tableau de bord thérapeute
    break;
  case 'client':
    setLocation('/portail');         // Portail client
    break;
  default:
    setLocation('/');               // Page d'accueil
}
```

### **Pages accessibles par rôle**
- **Admin** : Toutes les pages + `/admin`
- **Thérapeute** : Pages publiques + `/therapist-dashboard` + `/admin`
- **Client** : Pages publiques + `/portail`
- **Visiteur** : Pages publiques uniquement

## 🛡️ Sécurité

### **Protection des routes**
- Chaque page sensible est protégée par `ProtectedRoute`
- Vérification des permissions côté client et serveur
- Redirection automatique si non autorisé

### **Logs de sécurité**
- Toutes les connexions sont loggées
- Tentatives de connexion échouées sont tracées
- Audit complet pour conformité RGPD

## 📱 Interface Utilisateur

### **Navigation contextuelle**
- **Non connecté** : Bouton "Connexion" + "Inscription"
- **Connecté** : Boutons selon le rôle + profil utilisateur

### **Design unifié**
- Même formulaire de connexion pour tous
- Redirection transparente selon le rôle
- Interface cohérente sur toutes les pages

## ✅ Checklist de Test

- [ ] Connexion admin fonctionne
- [ ] Redirection vers `/admin` pour admin
- [ ] Connexion thérapeute fonctionne
- [ ] Redirection vers `/therapist-dashboard` pour thérapeute
- [ ] Connexion client fonctionne
- [ ] Redirection vers `/portail` pour client
- [ ] Navigation contextuelle selon le rôle
- [ ] Protection des routes sensibles
- [ ] Déconnexion fonctionne
- [ ] Retour à la page de connexion après déconnexion

---

**Note** : Le système est maintenant entièrement unifié avec une seule page de connexion qui redirige intelligemment selon le rôle de l'utilisateur.










