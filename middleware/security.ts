import { Request, Response, NextFunction } from 'express';
import rateLimit from 'express-rate-limit';
import helmet from 'helmet';
import { SECURITY_CONFIG, logSecurityEvent, detectSuspiciousActivity } from '../config/security';

// Middleware de sécurité général
export function securityMiddleware(req: Request, res: Response, next: NextFunction) {
  // Headers de sécurité
  Object.entries(SECURITY_CONFIG.SECURITY_HEADERS).forEach(([key, value]) => {
    res.setHeader(key, value);
  });

  // Log des requêtes suspectes
  if (detectSuspiciousActivity(req.ip || 'unknown', req.get('User-Agent') || '', req.path)) {
    logSecurityEvent('SUSPICIOUS_REQUEST', {
      path: req.path,
      method: req.method,
      ip: req.ip,
      userAgent: req.get('User-Agent')
    }, req);
  }

  next();
}

// Rate limiting général
export const generalRateLimit = rateLimit({
  windowMs: SECURITY_CONFIG.RATE_LIMIT.windowMs,
  max: SECURITY_CONFIG.RATE_LIMIT.max,
  message: {
    error: 'Trop de requêtes. Veuillez réessayer plus tard.',
    retryAfter: Math.ceil(SECURITY_CONFIG.RATE_LIMIT.windowMs / 1000)
  },
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res) => {
    logSecurityEvent('RATE_LIMIT_EXCEEDED', {
      ip: req.ip,
      path: req.path,
      userAgent: req.get('User-Agent')
    }, req);
    
    res.status(429).json({
      error: 'Trop de requêtes. Veuillez réessayer plus tard.',
      retryAfter: Math.ceil(SECURITY_CONFIG.RATE_LIMIT.windowMs / 1000)
    });
  }
});

// Rate limiting pour les tentatives de connexion
export const loginRateLimit = rateLimit({
  windowMs: SECURITY_CONFIG.RATE_LIMIT.loginWindow,
  max: SECURITY_CONFIG.RATE_LIMIT.loginMax,
  message: {
    error: 'Trop de tentatives de connexion. Veuillez réessayer dans 15 minutes.',
    retryAfter: Math.ceil(SECURITY_CONFIG.RATE_LIMIT.loginWindow / 1000)
  },
  standardHeaders: true,
  legacyHeaders: false,
  skipSuccessfulRequests: true, // Ne pas compter les connexions réussies
  handler: (req, res) => {
    logSecurityEvent('LOGIN_RATE_LIMIT_EXCEEDED', {
      ip: req.ip,
      email: req.body?.email,
      userAgent: req.get('User-Agent')
    }, req);
    
    res.status(429).json({
      error: 'Trop de tentatives de connexion. Veuillez réessayer dans 15 minutes.',
      retryAfter: Math.ceil(SECURITY_CONFIG.RATE_LIMIT.loginWindow / 1000)
    });
  }
});

// Rate limiting pour les paiements
export const paymentRateLimit = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 heure
  max: 10, // 10 paiements par heure par IP
  message: {
    error: 'Trop de tentatives de paiement. Veuillez réessayer plus tard.',
    retryAfter: 3600
  },
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res) => {
    logSecurityEvent('PAYMENT_RATE_LIMIT_EXCEEDED', {
      ip: req.ip,
      amount: req.body?.amount,
      userAgent: req.get('User-Agent')
    }, req);
    
    res.status(429).json({
      error: 'Trop de tentatives de paiement. Veuillez réessayer plus tard.',
      retryAfter: 3600
    });
  }
});

// Middleware de validation des entrées
export function inputValidation(req: Request, res: Response, next: NextFunction) {
  // Nettoyer les entrées utilisateur
  if (req.body) {
    Object.keys(req.body).forEach(key => {
      if (typeof req.body[key] === 'string') {
        req.body[key] = req.body[key].trim();
        
        // Détecter les tentatives d'injection
        const dangerousPatterns = [
          /<script/i,
          /javascript:/i,
          /on\w+\s*=/i,
          /eval\(/i,
          /expression\(/i
        ];
        
        if (dangerousPatterns.some(pattern => pattern.test(req.body[key]))) {
          logSecurityEvent('INJECTION_ATTEMPT', {
            field: key,
            value: req.body[key],
            ip: req.ip,
            path: req.path
          }, req);
          
          return res.status(400).json({
            error: 'Contenu suspect détecté'
          });
        }
      }
    });
  }

  next();
}

// Middleware de validation des emails
export function emailValidation(req: Request, res: Response, next: NextFunction) {
  if (req.body.email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    
    if (!emailRegex.test(req.body.email) || req.body.email.length > 254) {
      logSecurityEvent('INVALID_EMAIL_ATTEMPT', {
        email: req.body.email,
        ip: req.ip,
        path: req.path
      }, req);
      
      return res.status(400).json({
        error: 'Adresse email invalide'
      });
    }
  }

  next();
}

// Middleware de validation des mots de passe
export function passwordValidation(req: Request, res: Response, next: NextFunction) {
  if (req.body.password) {
    const { validatePassword } = require('../config/security');
    const validation = validatePassword(req.body.password);
    
    if (!validation.valid) {
      logSecurityEvent('WEAK_PASSWORD_ATTEMPT', {
        ip: req.ip,
        path: req.path,
        errors: validation.errors
      }, req);
      
      return res.status(400).json({
        error: 'Mot de passe trop faible',
        details: validation.errors
      });
    }
  }

  next();
}

// Middleware de validation des montants de paiement
export function paymentAmountValidation(req: Request, res: Response, next: NextFunction) {
  if (req.body.amount) {
    const amount = parseFloat(req.body.amount);
    
    if (isNaN(amount) || amount <= 0 || amount > 10000) {
      logSecurityEvent('INVALID_PAYMENT_AMOUNT', {
        amount: req.body.amount,
        ip: req.ip,
        path: req.path
      }, req);
      
      return res.status(400).json({
        error: 'Montant de paiement invalide'
      });
    }
  }

  next();
}

// Middleware de logging des événements de sécurité
export function securityLogging(req: Request, res: Response, next: NextFunction) {
  const originalSend = res.send;
  
  res.send = function(data) {
    // Log des erreurs de sécurité
    if (res.statusCode >= 400 && res.statusCode < 500) {
      logSecurityEvent('CLIENT_ERROR', {
        statusCode: res.statusCode,
        path: req.path,
        method: req.method,
        ip: req.ip,
        userAgent: req.get('User-Agent'),
        response: data
      }, req);
    }
    
    return originalSend.call(this, data);
  };
  
  next();
}

// Middleware de protection contre les attaques par déni de service
export function dosProtection(req: Request, res: Response, next: NextFunction) {
  // Vérifier la taille du payload
  if (req.get('content-length') && parseInt(req.get('content-length')!) > 1024 * 1024) {
    logSecurityEvent('LARGE_PAYLOAD_ATTEMPT', {
      contentLength: req.get('content-length'),
      ip: req.ip,
      path: req.path
    }, req);
    
    return res.status(413).json({
      error: 'Payload trop volumineux'
    });
  }
  
  next();
}

// Middleware de validation des tokens JWT
export function jwtValidation(req: Request, res: Response, next: NextFunction) {
  const token = req.headers.authorization?.replace('Bearer ', '');
  
  if (token) {
    try {
      const jwt = require('jsonwebtoken');
      const decoded = jwt.verify(token, SECURITY_CONFIG.JWT_SECRET);
      req.user = decoded;
    } catch (error) {
      logSecurityEvent('INVALID_JWT_TOKEN', {
        ip: req.ip,
        path: req.path,
        error: error.message
      }, req);
      
      return res.status(401).json({
        error: 'Token invalide'
      });
    }
  }
  
  next();
}








