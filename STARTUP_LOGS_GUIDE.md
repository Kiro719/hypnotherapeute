# 🔍 Test de Connexion avec Logs de Démarrage

## 🚀 **Serveur redémarré avec logs de démarrage**

Le serveur a été redémarré avec des logs de démarrage pour vérifier la configuration.

## 📋 **Logs attendus au démarrage :**

Vous devriez voir dans le terminal :

```
[STARTUP] Configuration admin chargée:
[STARTUP] Email: ninjaquentin22@gmail.com
[STARTUP] Nom: Administrateur
[STARTUP] Téléphone: +33 1 23 45 67 89
[STARTUP] Utilisateurs créés: 3
[STARTUP] - admin-1: ninjaquentin22@gmail.com (admin)
[STARTUP] - therapist-1: therapist@hypnotherapie.fr (therapist)
[STARTUP] - client-1: client@hypnotherapie.fr (client)
```

## 🔍 **Test de connexion maintenant :**

### **1. Vérifier les logs de démarrage**
- Regardez le terminal pour voir si la configuration admin est bien chargée
- Vérifiez que votre email `ninjaquentin22@gmail.com` apparaît dans les logs

### **2. Tester la connexion**
- **Email** : `ninjaquentin22@gmail.com`
- **Mot de passe** : `admin123`

### **3. Logs de connexion attendus :**
```
[DEBUG] Tentative de connexion pour: ninjaquentin22@gmail.com
[DEBUG] Utilisateur trouvé: ninjaquentin22@gmail.com (admin)
[DEBUG] Hash stocké: $2b$10$la5yFSWvBepfJ...
[DEBUG] Mot de passe fourni: admin123
[DEBUG] Mot de passe valide: true
[SECURITY] Successful login for ninjaquentin22@gmail.com (admin) - [timestamp]
```

## 🛠️ **Si les logs de démarrage ne s'affichent pas :**

### **Problème possible :**
- Le serveur n'utilise pas la nouvelle configuration
- Il y a un problème avec l'import de `ADMIN_CONFIG`

### **Solution :**
1. **Vérifier que le serveur est bien démarré**
2. **Regarder les logs de démarrage**
3. **Si pas de logs, redémarrer manuellement**

## 🔄 **Alternative : Test avec les autres comptes**

Si votre compte admin ne fonctionne toujours pas, testez avec :

### **Thérapeute :**
- **Email** : `therapist@hypnotherapie.fr`
- **Mot de passe** : `therapist123`

### **Client :**
- **Email** : `client@hypnotherapie.fr`
- **Mot de passe** : `client123`

## 📊 **Diagnostic complet :**

### **Étape 1 : Vérifier les logs de démarrage**
- ✅ Configuration admin chargée
- ✅ Email correct : `ninjaquentin22@gmail.com`
- ✅ Utilisateurs créés : 3

### **Étape 2 : Tester la connexion**
- ✅ Logs de débogage visibles
- ✅ Utilisateur trouvé
- ✅ Mot de passe valide

### **Étape 3 : Si problème persiste**
- 🔄 Redémarrer le serveur
- 🔍 Vérifier les imports
- 🌐 Considérer le déploiement en ligne

---

**Regardez d'abord les logs de démarrage dans le terminal, puis testez la connexion !** 🔍










