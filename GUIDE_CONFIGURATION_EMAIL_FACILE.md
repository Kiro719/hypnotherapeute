# 📧 GUIDE DE CONFIGURATION EMAIL - ULTRA SIMPLIFIÉ

---

## 🎯 CE QUE VOUS ALLEZ FAIRE

**Temps estimé :** 10 minutes maximum

**Résultat :** Vos clients recevront des emails automatiques depuis votre adresse professionnelle !

---

## 📋 ÉTAPE PAR ÉTAPE

### **ÉTAPE 1 : Créer votre email Gmail professionnel** (3 min)

1. **Ouvrez Chrome/Firefox en mode privé** :
   - **Chrome** : Ctrl + Shift + N
   - **Firefox** : Ctrl + Shift + P

2. **Allez sur** : https://accounts.google.com/signup

3. **Remplissez le formulaire** :
   ```
   Prénom         : Cabinet
   Nom            : Hypnothérapie
   Nom d'utilisateur : cabinet.hypno    (ou ce que vous voulez)
   Mot de passe   : Choisissez un mot de passe fort
   ```

4. **Validez** avec votre numéro de téléphone

5. **✏️ NOTEZ ICI** votre nouvel email :
   ```
   MON EMAIL PROFESSIONNEL : _______________________@gmail.com
   ```

---

### **ÉTAPE 2 : Activer la sécurité** (2 min)

1. **Allez sur** : https://myaccount.google.com/security

2. **Cherchez** la section **"Validation en deux étapes"**
   - C'est vers le milieu de la page

3. **Cliquez** sur le bouton bleu **"Activer"**

4. **Suivez les étapes** :
   - Google va vous demander votre numéro de téléphone
   - Vous recevrez un code par SMS
   - Entrez le code

5. **C'est fait !** Vous voyez maintenant "Activée" ✅

---

### **ÉTAPE 3 : Créer le mot de passe d'application** (2 min)

⚠️ **IMPORTANT** : C'est cette étape qui permet aux emails de s'envoyer !

1. **Restez sur** : https://myaccount.google.com/security

2. **Rechargez la page** si besoin (F5)

3. **Cherchez** la section **"Mots de passe des applications"**
   - Elle apparaît quelques lignes après "Validation en deux étapes"
   - Si vous ne la voyez pas, attendez 1 minute et rechargez

4. **Cliquez dessus**

5. **Dans le menu déroulant "Sélectionner l'application"** :
   - Choisissez : **"Autre (nom personnalisé)"**

6. **Tapez** : `Cabinet Hypnothérapie`

7. **Cliquez** sur **"Générer"**

8. **⚠️ UNE BOÎTE JAUNE APPARAÎT** avec un mot de passe de 16 caractères :
   ```
   Exemple : abcd efgh ijkl mnop
   ```

9. **✏️ COPIEZ-LE IMMÉDIATEMENT** (il ne sera plus affiché) :
   ```
   MOT DE PASSE D'APPLICATION : ____ ____ ____ ____
   ```

10. **Cliquez** sur "OK"

---

### **ÉTAPE 4 : Configurer le fichier .env** (3 min)

1. **Ouvrez votre projet** dans l'explorateur de fichiers

2. **Cherchez le fichier** : `env.example`
   - Il est à la racine du projet (à côté de `package.json`)

3. **Faites un clic droit** → **"Copier"**

4. **Faites un clic droit** dans le même dossier → **"Coller"**

5. **Renommez** le fichier copié en : `.env` (juste `.env`, sans "example")
   - ⚠️ Attention : Le point `.` au début est important !

6. **Ouvrez le fichier `.env`** avec un éditeur de texte (Bloc-notes ou VSCode)

7. **Cherchez** les lignes (vers la fin du fichier) :
   ```env
   SMTP_USER=VOTRE_EMAIL_ICI@gmail.com
   SMTP_PASS=VOTRE_MOT_DE_PASSE_APPLICATION_ICI
   SMTP_FROM=VOTRE_EMAIL_ICI@gmail.com
   ```

8. **Remplacez** par VOS vraies informations :
   ```env
   SMTP_USER=cabinet.hypno@gmail.com
   SMTP_PASS=abcd efgh ijkl mnop
   SMTP_FROM=cabinet.hypno@gmail.com
   ```
   
   **Exemple réel :**
   ```env
   SMTP_USER=mon.cabinet@gmail.com
   SMTP_PASS=xkcd zqwe asdf hjkl
   SMTP_FROM=mon.cabinet@gmail.com
   ```

9. **Sauvegardez** le fichier (Ctrl + S)

10. **Fermez** le fichier

---

### **ÉTAPE 5 : Tester que tout fonctionne** (2 min)

1. **Ouvrez PowerShell** dans votre dossier projet :
   - Faites un clic droit dans le dossier
   - Choisissez "Ouvrir dans PowerShell" ou "Ouvrir dans Terminal"

2. **Tapez** cette commande :
   ```powershell
   npm run dev
   ```

3. **Attendez** que le serveur démarre (environ 10-20 secondes)

4. **Vous devriez voir** :
   ```
   Server running on port 5000
   ```

5. **Ouvrez Chrome** et allez sur :
   ```
   http://localhost:5000/api/emails/test-connection
   ```

6. **Si vous voyez ça, c'est BON !** ✅
   ```json
   {
     "success": true,
     "message": "Connexion SMTP réussie"
   }
   ```

7. **Si vous voyez ça, c'est PAS BON** ❌
   ```json
   {
     "success": false,
     "error": "..."
   }
   ```
   → Vérifiez que vous avez bien copié l'email et le mot de passe d'application

---

## ✅ C'EST TERMINÉ !

Votre système d'emails est maintenant **100% opérationnel** ! 🎉

### **Que se passe-t-il maintenant ?**

Les emails s'enverront **automatiquement** quand :

- ✅ **Un client réserve** → Email de confirmation immédiat
- ⏰ **24h avant le RDV** → Email de rappel automatique
- 🙏 **Après une séance** → Email de remerciement
- ⭐ **3 jours après** → Email de demande d'avis
- 👋 **Nouveau client** → Email de bienvenue

**Vous n'avez rien à faire, tout est automatique !**

---

## 🎨 BONUS : Personnaliser le nom d'expéditeur

Dans le fichier `.env`, vous pouvez changer :

```env
SMTP_FROM_NAME=Cabinet d'Hypnothérapie
```

Par ce que vous voulez :

```env
SMTP_FROM_NAME=Marie Dupont - Hypnothérapeute
SMTP_FROM_NAME=Cabinet Zen & Bien-être
SMTP_FROM_NAME=Votre Prénom - Hypnose
```

Les clients verront ce nom dans leur boîte email !

---

## 🆘 PROBLÈMES ?

### **Je ne vois pas "Mots de passe des applications"**

➜ La validation en 2 étapes n'est pas encore active.
- Attendez 2-3 minutes
- Rechargez la page (F5)
- Déconnectez-vous et reconnectez-vous

---

### **Le test affiche `"success": false`**

➜ Vérifiez que :
1. L'email est bien copié (sans espace avant/après)
2. Le mot de passe d'application est bien le BON (16 caractères)
   - ⚠️ Ce n'est PAS votre mot de passe Gmail normal
   - C'est le mot de passe d'application généré (type: `abcd efgh ijkl mnop`)
3. Le fichier s'appelle bien `.env` (avec le point au début)

---

### **Le serveur ne démarre pas**

➜ Tapez :
```powershell
npm install
```

Puis relancez :
```powershell
npm run dev
```

---

### **J'ai perdu le mot de passe d'application**

Pas de panique ! Vous pouvez en générer un nouveau :

1. Allez sur : https://myaccount.google.com/security
2. "Mots de passe des applications"
3. Régénérez-en un nouveau
4. Remplacez dans le `.env`

---

## 📞 BESOIN D'AIDE ?

Faites une capture d'écran et montrez-moi où vous êtes bloqué ! 🚀

---

## 📊 TABLEAU RÉCAPITULATIF

| Étape | Quoi faire | Temps |
|-------|-----------|-------|
| 1 | Créer email Gmail | 3 min |
| 2 | Activer 2FA | 2 min |
| 3 | Générer mot de passe app | 2 min |
| 4 | Modifier le .env | 3 min |
| 5 | Tester | 2 min |
| **TOTAL** | **12 minutes** | ✅ |

---

**Bonne configuration ! 🎉**







