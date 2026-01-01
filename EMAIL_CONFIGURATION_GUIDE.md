# 📧 Guide de Configuration des Emails

## 🎯 Vue d'ensemble

Ce guide explique comment configurer le système de notifications email automatiques pour votre site d'hypnothérapie.

---

## 📋 Table des Matières

1. [Installation](#installation)
2. [Configuration Gmail](#configuration-gmail)
3. [Configuration Autre Fournisseur](#configuration-autre-fournisseur)
4. [Variables d'Environnement](#variables-denvironnement)
5. [Test de Configuration](#test-de-configuration)
6. [Types d'Emails Envoyés](#types-demails-envoyés)
7. [Personnalisation](#personnalisation)
8. [Dépannage](#dépannage)

---

## 1. Installation

### Installer les dépendances

```bash
npm install nodemailer
npm install --save-dev @types/nodemailer
```

---

## 2. Configuration Gmail

### Étape 1 : Créer un mot de passe d'application

1. Allez sur votre compte Google : https://myaccount.google.com
2. Cliquez sur **Sécurité** dans le menu de gauche
3. Sous "Se connecter à Google", activez la **Validation en deux étapes** (si ce n'est pas déjà fait)
4. Une fois la 2FA activée, retournez dans **Sécurité**
5. Cliquez sur **Mots de passe des applications**
6. Sélectionnez "Autre (nom personnalisé)" et entrez "Cabinet Hypnothérapie"
7. Cliquez sur **Générer**
8. **Copiez le mot de passe généré** (16 caractères sans espaces)

### Étape 2 : Configurer le fichier .env

```env
# Configuration Gmail
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false

SMTP_USER=votre.email@gmail.com
SMTP_PASS=xxxx xxxx xxxx xxxx  # Le mot de passe d'application de 16 caractères

SMTP_FROM=votre.email@gmail.com
SMTP_FROM_NAME=Cabinet d'Hypnothérapie
```

---

## 3. Configuration Autre Fournisseur

### Outlook / Hotmail

```env
SMTP_HOST=smtp-mail.outlook.com
SMTP_PORT=587
SMTP_SECURE=false

SMTP_USER=votre.email@outlook.com
SMTP_PASS=votre_mot_de_passe

SMTP_FROM=votre.email@outlook.com
SMTP_FROM_NAME=Cabinet d'Hypnothérapie
```

### OVH

```env
SMTP_HOST=ssl0.ovh.net
SMTP_PORT=587
SMTP_SECURE=false

SMTP_USER=votre.email@votredomaine.fr
SMTP_PASS=votre_mot_de_passe

SMTP_FROM=votre.email@votredomaine.fr
SMTP_FROM_NAME=Cabinet d'Hypnothérapie
```

### Sendinblue / Brevo

```env
SMTP_HOST=smtp-relay.sendinblue.com
SMTP_PORT=587
SMTP_SECURE=false

SMTP_USER=votre.email@votredomaine.fr
SMTP_PASS=votre_cle_api_smtp

SMTP_FROM=votre.email@votredomaine.fr
SMTP_FROM_NAME=Cabinet d'Hypnothérapie
```

### SendGrid

```env
SMTP_HOST=smtp.sendgrid.net
SMTP_PORT=587
SMTP_SECURE=false

SMTP_USER=apikey
SMTP_PASS=votre_api_key_sendgrid

SMTP_FROM=votre.email@votredomaine.fr
SMTP_FROM_NAME=Cabinet d'Hypnothérapie
```

---

## 4. Variables d'Environnement

Voici toutes les variables disponibles :

| Variable | Description | Exemple | Requis |
|----------|-------------|---------|--------|
| `SMTP_HOST` | Serveur SMTP | `smtp.gmail.com` | ✅ |
| `SMTP_PORT` | Port SMTP | `587` | ✅ |
| `SMTP_SECURE` | SSL/TLS | `false` (587) ou `true` (465) | ✅ |
| `SMTP_USER` | Email de connexion | `contact@cabinet.fr` | ✅ |
| `SMTP_PASS` | Mot de passe SMTP | `xxxx xxxx xxxx xxxx` | ✅ |
| `SMTP_FROM` | Email expéditeur | `contact@cabinet.fr` | ✅ |
| `SMTP_FROM_NAME` | Nom expéditeur | `Cabinet d'Hypnothérapie` | ❌ |

---

## 5. Test de Configuration

### Test 1 : Vérification de la connexion SMTP

Créez un fichier `test-email.ts` :

```typescript
import { emailService } from './server/lib/email-service';

async function testConnection() {
  const isConnected = await emailService.verifyConnection();
  
  if (isConnected) {
    console.log('✅ Connexion SMTP réussie !');
  } else {
    console.error('❌ Échec de la connexion SMTP');
  }
}

testConnection();
```

Exécutez :
```bash
npx tsx test-email.ts
```

### Test 2 : Envoi d'un email de test

```typescript
import { emailService } from './server/lib/email-service';

async function sendTestEmail() {
  const success = await emailService.sendEmail({
    to: 'votre.email@test.com',
    subject: 'Test d\'envoi',
    html: '<h1>Hello World!</h1><p>Email de test réussi.</p>',
  }, 'newsletter');
  
  if (success) {
    console.log('✅ Email envoyé avec succès !');
  } else {
    console.error('❌ Échec de l\'envoi');
  }
}

sendTestEmail();
```

---

## 6. Types d'Emails Envoyés

### 1. Email de Confirmation (Immédiat)

**Déclenché par** : Nouvelle réservation  
**Contenu** :
- Détails du rendez-vous
- Date, heure, service
- Adresse du cabinet
- Numéro de confirmation

### 2. Email de Rappel (24h avant)

**Déclenché par** : Cron automatique  
**Fréquence** : Toutes les 6 heures  
**Contenu** :
- Rappel du RDV de demain
- Conseils de préparation
- Lien vers le portail client

### 3. Email de Remerciement (2h après)

**Déclenché par** : Cron automatique  
**Fréquence** : Toutes les 3 heures  
**Contenu** :
- Remerciement post-séance
- Recommandations
- Lien pour reprendre RDV

### 4. Demande d'Avis (3 jours après)

**Déclenché par** : Cron automatique  
**Fréquence** : Quotidienne (10h)  
**Contenu** :
- Demande de notation
- Lien vers formulaire d'avis
- Offre de fidélité

### 5. Email de Bienvenue (Inscription)

**Déclenché par** : Création de compte  
**Contenu** :
- Message de bienvenue
- Code promo -15%
- Présentation des services

### 6. Email d'Annulation

**Déclenché par** : Annulation de RDV  
**Contenu** :
- Confirmation d'annulation
- Détails du RDV annulé
- Lien pour reprendre RDV

---

## 7. Personnalisation

### Modifier les Templates

Les templates se trouvent dans `server/lib/email-templates.ts`

**Exemple : Modifier le header**

```typescript
// Dans la fonction baseTemplate()
.header {
  background: linear-gradient(135deg, #votre-couleur1 0%, #votre-couleur2 100%);
  padding: 40px 20px;
  text-align: center;
  color: #ffffff;
}
```

### Ajouter votre Logo

```html
<div class="header">
  <img src="https://votre-site.fr/logo.png" alt="Logo" style="height: 60px; margin-bottom: 10px;">
  <h1 class="logo">Cabinet d'Hypnothérapie</h1>
</div>
```

### Personnaliser les Couleurs

```css
/* Couleur principale */
background-color: #2d8a8a; /* Remplacez par votre couleur */

/* Couleur des boutons */
.button {
  background-color: #votre-couleur;
}
```

### Modifier l'Adresse du Cabinet

Dans `server/lib/email-templates.ts`, remplacez :

```typescript
location: "[Adresse du cabinet]"
```

Par votre vraie adresse :

```typescript
location: "123 Rue de la Paix, 75001 Paris"
```

---

## 8. Dépannage

### ❌ Erreur : "Invalid login"

**Cause** : Mot de passe incorrect ou 2FA non activée (Gmail)

**Solution** :
1. Vérifiez que vous utilisez un **mot de passe d'application** (pas votre mot de passe Gmail)
2. Vérifiez que la **validation en deux étapes** est activée
3. Régénérez un nouveau mot de passe d'application

### ❌ Erreur : "Connection timeout"

**Cause** : Pare-feu ou port bloqué

**Solution** :
1. Vérifiez que le port 587 n'est pas bloqué
2. Essayez le port 465 avec `SMTP_SECURE=true`
3. Vérifiez votre connexion internet

### ❌ Emails non reçus

**Cause** : Dans les spams ou mauvaise configuration

**Solution** :
1. Vérifiez le dossier **spam/courrier indésirable**
2. Ajoutez votre email à la liste blanche
3. Vérifiez `SMTP_FROM` = même adresse que `SMTP_USER`

### ❌ Erreur : "SMTP not configured"

**Cause** : Fichier .env non chargé

**Solution** :
1. Vérifiez que le fichier `.env` existe à la racine
2. Redémarrez le serveur : `npm run dev`
3. Vérifiez les logs au démarrage

---

## 📊 Monitoring des Emails

### Voir les Statistiques

Accédez à `/api/emails/stats` (route admin) :

```json
{
  "total": 150,
  "sent": 142,
  "failed": 8,
  "successRate": 94.7,
  "byType": {
    "appointment_confirmation": 50,
    "appointment_reminder": 45,
    "appointment_thanks": 30,
    "review_request": 25
  }
}
```

### Voir les Logs

Accédez à `/api/emails/logs` (route admin) :

```json
[
  {
    "id": "email_1234567890_abc123",
    "to": "client@example.com",
    "subject": "Confirmation de votre rendez-vous",
    "type": "appointment_confirmation",
    "status": "sent",
    "sentAt": "2024-10-21T10:30:00.000Z"
  }
]
```

---

## 🔒 Sécurité

### Bonnes Pratiques

✅ **À faire** :
- Utiliser un mot de passe d'application (Gmail)
- Stocker les credentials dans `.env` (jamais dans le code)
- Utiliser HTTPS pour les liens dans les emails
- Limiter le taux d'envoi (rate limiting)
- Logger tous les envois

❌ **À éviter** :
- Hardcoder les mots de passe
- Utiliser votre mot de passe personnel
- Envoyer des emails en masse sans consentement
- Inclure des données sensibles dans les emails

---

## 📞 Support

En cas de problème :
1. Consultez les logs : `npm run dev` (regardez la console)
2. Testez la connexion SMTP
3. Vérifiez le fichier `.env`
4. Contactez le support de votre fournisseur email

---

**Document mis à jour le** : 21 octobre 2024  
**Version** : 1.0







