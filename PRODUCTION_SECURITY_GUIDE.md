# Guide de Sécurité pour la Mise en Production

## 🔐 Sécurité des Données Bancaires

### Stripe (Recommandé)
- **Conformité PCI DSS** : Stripe gère automatiquement la conformité
- **Chiffrement** : Toutes les données bancaires sont chiffrées
- **Tokenisation** : Les cartes sont tokenisées, jamais stockées
- **3D Secure** : Authentification renforcée pour les paiements

### Configuration
```env
# Production
STRIPE_SECRET_KEY=sk_live_votre_cle_secrete
VITE_STRIPE_PUBLISHABLE_KEY=pk_live_votre_cle_publique

# Webhooks (obligatoire)
STRIPE_WEBHOOK_SECRET=whsec_votre_secret_webhook
```

## 🔒 Sécurité des Mots de Passe

### 1. Hachage sécurisé (bcrypt)
```typescript
// Déjà implémenté dans votre code
import bcrypt from 'bcryptjs';

const saltRounds = 12; // Augmenter pour la production
const hashedPassword = await bcrypt.hash(password, saltRounds);
```

### 2. Politique de mots de passe
```typescript
const passwordPolicy = {
  minLength: 8,
  requireUppercase: true,
  requireLowercase: true,
  requireNumbers: true,
  requireSpecialChars: true,
  maxAttempts: 5,
  lockoutDuration: 15 // minutes
};
```

### 3. Authentification à deux facteurs (2FA)
```typescript
// À implémenter avec TOTP (Google Authenticator)
import speakeasy from 'speakeasy';

const secret = speakeasy.generateSecret({
  name: 'Hypnothérapie App',
  issuer: 'Votre Nom'
});
```

## 📧 Sécurité des Emails

### 1. Chiffrement en transit (TLS/SSL)
```typescript
// Configuration SMTP sécurisée
const emailConfig = {
  host: 'smtp.gmail.com',
  port: 587,
  secure: false, // true pour port 465
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_APP_PASSWORD // Mot de passe d'application
  },
  tls: {
    rejectUnauthorized: false
  }
};
```

### 2. Services recommandés
- **SendGrid** : Professionnel, fiable
- **Mailgun** : Simple à intégrer
- **AWS SES** : Économique, scalable

### 3. Protection contre le spam
```typescript
// Rate limiting pour les emails
const emailRateLimit = {
  maxEmailsPerHour: 10,
  maxEmailsPerDay: 50,
  blacklistDomains: ['tempmail.com', '10minutemail.com']
};
```

## 🛡️ Sécurité Générale

### 1. Headers de sécurité
```typescript
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "'unsafe-inline'", "https://js.stripe.com"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      imgSrc: ["'self'", "data:", "https:"],
      connectSrc: ["'self'", "https://api.stripe.com"]
    }
  }
}));
```

### 2. Variables d'environnement
```env
# Base de données
DATABASE_URL=postgresql://user:password@host:port/database
DATABASE_SSL=true

# JWT
JWT_SECRET=votre_secret_jwt_tres_long_et_complexe
JWT_EXPIRES_IN=24h

# Email
EMAIL_USER=votre_email@gmail.com
EMAIL_APP_PASSWORD=votre_mot_de_passe_application

# Stripe
STRIPE_SECRET_KEY=sk_live_votre_cle_secrete
VITE_STRIPE_PUBLISHABLE_KEY=pk_live_votre_cle_publique
STRIPE_WEBHOOK_SECRET=whsec_votre_secret_webhook

# Sécurité
BCRYPT_ROUNDS=12
RATE_LIMIT_WINDOW=15
RATE_LIMIT_MAX=100
```

### 3. Base de données sécurisée
```typescript
// Chiffrement des données sensibles
import crypto from 'crypto';

const encrypt = (text: string) => {
  const cipher = crypto.createCipher('aes-256-cbc', process.env.ENCRYPTION_KEY);
  let encrypted = cipher.update(text, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  return encrypted;
};
```

## 🔍 Monitoring et Logs

### 1. Logs de sécurité
```typescript
// Logs des tentatives de connexion
const logSecurityEvent = (event: string, details: any) => {
  console.log(`[SECURITY] ${new Date().toISOString()} - ${event}:`, {
    ip: req.ip,
    userAgent: req.get('User-Agent'),
    ...details
  });
};
```

### 2. Alertes automatiques
```typescript
// Alertes pour les tentatives suspectes
const alertSuspiciousActivity = async (details: any) => {
  if (details.failedAttempts > 5) {
    // Envoyer une alerte email
    await sendSecurityAlert(details);
  }
};
```

## 📋 Checklist de mise en production

### Avant la mise en ligne :
- [ ] Changer tous les mots de passe par défaut
- [ ] Configurer HTTPS (SSL/TLS)
- [ ] Activer les headers de sécurité
- [ ] Configurer les variables d'environnement
- [ ] Tester les webhooks Stripe
- [ ] Configurer la sauvegarde de base de données
- [ ] Activer le monitoring
- [ ] Tester la récupération de mot de passe
- [ ] Vérifier la conformité RGPD

### Après la mise en ligne :
- [ ] Monitorer les logs de sécurité
- [ ] Vérifier les performances
- [ ] Tester les paiements en mode live
- [ ] Valider les emails de confirmation
- [ ] Surveiller les tentatives d'intrusion

## 🚨 Actions d'urgence

### En cas de compromission :
1. Changer immédiatement tous les mots de passe
2. Révoquer les tokens JWT
3. Notifier les utilisateurs
4. Analyser les logs
5. Mettre à jour les certificats de sécurité

## 📞 Support et maintenance

### Services recommandés :
- **Monitoring** : Sentry, LogRocket
- **Backup** : AWS RDS, Google Cloud SQL
- **CDN** : Cloudflare (avec protection DDoS)
- **SSL** : Let's Encrypt (gratuit) ou certificats commerciaux








