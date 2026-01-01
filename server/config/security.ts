import bcrypt from 'bcryptjs';
import crypto from 'crypto';

// Configuration de sécurité pour la production
export const SECURITY_CONFIG = {
  // Hachage des mots de passe
  BCRYPT_ROUNDS: parseInt(process.env.BCRYPT_ROUNDS || '12'),
  
  // JWT
  JWT_SECRET: process.env.JWT_SECRET || 'change-this-in-production',
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || '24h',
  
  // Rate limiting
  RATE_LIMIT: {
    windowMs: parseInt(process.env.RATE_LIMIT_WINDOW || '15') * 60 * 1000, // 15 minutes
    max: parseInt(process.env.RATE_LIMIT_MAX || '100'), // 100 requêtes par fenêtre
    loginMax: 5, // 5 tentatives de connexion
    loginWindow: 15 * 60 * 1000, // 15 minutes
  },
  
  // Politique des mots de passe
  PASSWORD_POLICY: {
    minLength: 8,
    requireUppercase: true,
    requireLowercase: true,
    requireNumbers: true,
    requireSpecialChars: true,
    maxAge: 90 * 24 * 60 * 60 * 1000, // 90 jours
  },
  
  // Chiffrement des données sensibles
  ENCRYPTION_KEY: process.env.ENCRYPTION_KEY || 'change-this-encryption-key',
  
  // Headers de sécurité
  SECURITY_HEADERS: {
    'X-Content-Type-Options': 'nosniff',
    'X-Frame-Options': 'DENY',
    'X-XSS-Protection': '1; mode=block',
    'Strict-Transport-Security': 'max-age=31536000; includeSubDomains',
    'Referrer-Policy': 'strict-origin-when-cross-origin',
    'Content-Security-Policy': "default-src 'self'; script-src 'self' 'unsafe-inline' https://js.stripe.com; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; connect-src 'self' https://api.stripe.com;"
  }
};

// Fonction de hachage sécurisée
export async function hashPassword(password: string): Promise<string> {
  return await bcrypt.hash(password, SECURITY_CONFIG.BCRYPT_ROUNDS);
}

// Fonction de vérification de mot de passe
export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return await bcrypt.compare(password, hash);
}

// Fonction de validation de mot de passe
export function validatePassword(password: string): { valid: boolean; errors: string[] } {
  const errors: string[] = [];
  const policy = SECURITY_CONFIG.PASSWORD_POLICY;
  
  if (password.length < policy.minLength) {
    errors.push(`Le mot de passe doit contenir au moins ${policy.minLength} caractères`);
  }
  
  if (policy.requireUppercase && !/[A-Z]/.test(password)) {
    errors.push('Le mot de passe doit contenir au moins une majuscule');
  }
  
  if (policy.requireLowercase && !/[a-z]/.test(password)) {
    errors.push('Le mot de passe doit contenir au moins une minuscule');
  }
  
  if (policy.requireNumbers && !/\d/.test(password)) {
    errors.push('Le mot de passe doit contenir au moins un chiffre');
  }
  
  if (policy.requireSpecialChars && !/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
    errors.push('Le mot de passe doit contenir au moins un caractère spécial');
  }
  
  return {
    valid: errors.length === 0,
    errors
  };
}

// Fonction de chiffrement des données sensibles
export function encryptSensitiveData(text: string): string {
  const cipher = crypto.createCipher('aes-256-cbc', SECURITY_CONFIG.ENCRYPTION_KEY);
  let encrypted = cipher.update(text, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  return encrypted;
}

// Fonction de déchiffrement des données sensibles
export function decryptSensitiveData(encryptedText: string): string {
  const decipher = crypto.createDecipher('aes-256-cbc', SECURITY_CONFIG.ENCRYPTION_KEY);
  let decrypted = decipher.update(encryptedText, 'hex', 'utf8');
  decrypted += decipher.final('utf8');
  return decrypted;
}

// Fonction de génération de token sécurisé
export function generateSecureToken(length: number = 32): string {
  return crypto.randomBytes(length).toString('hex');
}

// Fonction de validation d'email
export function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email) && email.length <= 254;
}

// Fonction de nettoyage des entrées utilisateur
export function sanitizeInput(input: string): string {
  return input
    .trim()
    .replace(/[<>]/g, '') // Supprimer les balises HTML
    .substring(0, 1000); // Limiter la longueur
}

// Fonction de génération de mot de passe sécurisé
export function generateSecurePassword(length: number = 12): string {
  const charset = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*';
  let password = '';
  
  // S'assurer qu'on a au moins un caractère de chaque type
  password += 'abcdefghijklmnopqrstuvwxyz'[Math.floor(Math.random() * 26)];
  password += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'[Math.floor(Math.random() * 26)];
  password += '0123456789'[Math.floor(Math.random() * 10)];
  password += '!@#$%^&*'[Math.floor(Math.random() * 8)];
  
  // Remplir le reste
  for (let i = 4; i < length; i++) {
    password += charset[Math.floor(Math.random() * charset.length)];
  }
  
  // Mélanger le mot de passe
  return password.split('').sort(() => Math.random() - 0.5).join('');
}

// Fonction de log des événements de sécurité
export function logSecurityEvent(event: string, details: any, req?: any) {
  const logEntry = {
    timestamp: new Date().toISOString(),
    event,
    ip: req?.ip || 'unknown',
    userAgent: req?.get('User-Agent') || 'unknown',
    ...details
  };
  
  console.log(`[SECURITY] ${JSON.stringify(logEntry)}`);
  
  // En production, vous pourriez envoyer ces logs à un service de monitoring
  // comme Sentry, LogRocket, ou un SIEM
}

// Fonction de détection d'activité suspecte
export function detectSuspiciousActivity(ip: string, userAgent: string, event: string): boolean {
  // Logique simple de détection d'anomalies
  // En production, utilisez des outils plus sophistiqués comme AWS GuardDuty
  
  const suspiciousPatterns = [
    /bot/i,
    /crawler/i,
    /scanner/i,
    /sqlmap/i,
    /nikto/i
  ];
  
  return suspiciousPatterns.some(pattern => 
    pattern.test(userAgent) || pattern.test(event)
  );
}








