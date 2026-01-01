# 🚀 Démarrage Rapide - Système d'Emails

## ⚡ Configuration en 5 Minutes

### Étape 1 : Installer les dépendances

```bash
npm install
```

### Étape 2 : Configurer Gmail (recommandé)

1. Allez sur https://myaccount.google.com/apppasswords
2. Créez un mot de passe d'application nommé "Cabinet Hypnothérapie"
3. Copiez le mot de passe (16 caractères)

### Étape 3 : Modifier le fichier `.env`

```env
# Ajoutez ces lignes à votre fichier .env

SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false

SMTP_USER=votre.email@gmail.com
SMTP_PASS=xxxx xxxx xxxx xxxx  # Le mot de passe d'application

SMTP_FROM=votre.email@gmail.com
SMTP_FROM_NAME=Cabinet d'Hypnothérapie
```

### Étape 4 : Démarrer le serveur

```bash
npm run dev
```

### Étape 5 : Tester la configuration

Ouvrez votre navigateur sur :
```
http://localhost:5000/api/emails/test-connection
```

Vous devriez voir :
```json
{
  "success": true,
  "message": "Connexion SMTP réussie"
}
```

---

## 🎉 C'est tout !

Votre système d'emails est prêt. Les emails seront automatiquement envoyés :

- ✅ **Confirmation** après chaque réservation
- ⏰ **Rappel** 24h avant le rendez-vous
- 🙏 **Remerciement** après la séance
- ⭐ **Demande d'avis** 3 jours après

---

## 📊 Surveiller les Emails

### Statistiques
```
GET http://localhost:5000/api/emails/stats
```

### Logs
```
GET http://localhost:5000/api/emails/logs?limit=50
```

---

## 🛠️ Personnalisation

Les templates se trouvent dans :
```
server/lib/email-templates.ts
```

---

## 🆘 Problème ?

Consultez `EMAIL_CONFIGURATION_GUIDE.md` pour le guide complet.







