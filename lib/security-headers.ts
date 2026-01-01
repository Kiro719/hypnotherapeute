// Configuration des headers de sécurité
import { Request, Response, NextFunction } from 'express';

// Headers de sécurité essentiels
export function securityHeaders(req: Request, res: Response, next: NextFunction) {
  // 1. Content Security Policy (CSP) - Protection contre XSS
  res.setHeader('Content-Security-Policy', [
    "default-src 'self'",
    "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://fonts.googleapis.com",
    "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
    "font-src 'self' https://fonts.gstatic.com",
    "img-src 'self' data: https:",
    "connect-src 'self'",
    "frame-ancestors 'none'",
    "base-uri 'self'",
    "form-action 'self'"
  ].join('; '));

  // 2. X-Frame-Options - Protection contre clickjacking
  res.setHeader('X-Frame-Options', 'DENY');

  // 3. X-Content-Type-Options - Protection contre MIME sniffing
  res.setHeader('X-Content-Type-Options', 'nosniff');

  // 4. X-XSS-Protection - Protection XSS (legacy browsers)
  res.setHeader('X-XSS-Protection', '1; mode=block');

  // 5. Referrer-Policy - Contrôle des informations de référent
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');

  // 6. Permissions-Policy - Contrôle des fonctionnalités du navigateur
  res.setHeader('Permissions-Policy', [
    'camera=()',
    'microphone=()',
    'geolocation=()',
    'payment=()',
    'usb=()',
    'magnetometer=()',
    'gyroscope=()',
    'accelerometer=()'
  ].join(', '));

  // 7. Strict-Transport-Security (HSTS) - Force HTTPS
  if (req.secure || req.headers['x-forwarded-proto'] === 'https') {
    res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains; preload');
  }

  // 8. Cross-Origin-Embedder-Policy - Protection contre les attaques cross-origin
  res.setHeader('Cross-Origin-Embedder-Policy', 'require-corp');

  // 9. Cross-Origin-Opener-Policy - Isolation des contextes de navigation
  res.setHeader('Cross-Origin-Opener-Policy', 'same-origin');

  // 10. Cross-Origin-Resource-Policy - Contrôle des ressources cross-origin
  res.setHeader('Cross-Origin-Resource-Policy', 'same-origin');

  // 11. Cache-Control pour les pages sensibles
  if (req.path.startsWith('/admin') || req.path.startsWith('/api/auth')) {
    res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
    res.setHeader('Pragma', 'no-cache');
    res.setHeader('Expires', '0');
  }

  // 12. X-Powered-By - Masquer la technologie utilisée
  res.removeHeader('X-Powered-By');

  next();
}

// Configuration CORS sécurisée
export function secureCORS(req: Request, res: Response, next: NextFunction) {
  const origin = req.headers.origin;
  const allowedOrigins = [
    'http://localhost:3000',
    'http://localhost:5000',
    'https://votre-domaine.com' // Remplacer par votre domaine de production
  ];

  // Vérifier l'origine
  if (origin && allowedOrigins.includes(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin);
  }

  // Headers CORS sécurisés
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With');
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Max-Age', '86400'); // 24 heures

  // Gérer les requêtes preflight
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  next();
}

// Middleware de protection contre les attaques par déni de service
export function dosProtection(req: Request, res: Response, next: NextFunction) {
  // Limiter la taille des requêtes
  const maxRequestSize = 1024 * 1024; // 1MB
  const contentLength = parseInt(req.headers['content-length'] || '0');
  
  if (contentLength > maxRequestSize) {
    return res.status(413).json({ error: 'Requête trop volumineuse' });
  }

  // Limiter le nombre de paramètres
  const paramCount = Object.keys(req.query).length + Object.keys(req.body || {}).length;
  if (paramCount > 50) {
    return res.status(400).json({ error: 'Trop de paramètres dans la requête' });
  }

  next();
}

// Middleware de protection contre les attaques par injection
export function injectionProtection(req: Request, res: Response, next: NextFunction) {
  const dangerousPatterns = [
    /<script/i,
    /javascript:/i,
    /on\w+\s*=/i,
    /eval\s*\(/i,
    /expression\s*\(/i,
    /vbscript:/i,
    /data:text\/html/i
  ];

  const checkForInjection = (obj: any, path: string = ''): boolean => {
    if (typeof obj === 'string') {
      for (const pattern of dangerousPatterns) {
        if (pattern.test(obj)) {
          console.log(`[SECURITY] Injection attempt detected in ${path}: ${obj.substring(0, 100)}`);
          return true;
        }
      }
    } else if (Array.isArray(obj)) {
      return obj.some((item, index) => checkForInjection(item, `${path}[${index}]`));
    } else if (obj && typeof obj === 'object') {
      return Object.entries(obj).some(([key, value]) => 
        checkForInjection(value, path ? `${path}.${key}` : key)
      );
    }
    return false;
  };

  if (checkForInjection(req.body) || checkForInjection(req.query)) {
    return res.status(400).json({ error: 'Contenu malveillant détecté' });
  }

  next();
}

// Middleware de logging de sécurité
export function securityLogging(req: Request, res: Response, next: NextFunction) {
  const startTime = Date.now();
  const clientIP = req.ip || req.connection.remoteAddress || 'unknown';
  
  // Log des requêtes sensibles
  if (req.path.includes('/auth') || req.path.includes('/admin')) {
    console.log(`[SECURITY] ${req.method} ${req.path} from ${clientIP} at ${new Date().toISOString()}`);
  }

  res.on('finish', () => {
    const duration = Date.now() - startTime;
    
    // Log des erreurs de sécurité
    if (res.statusCode >= 400) {
      console.log(`[SECURITY] Error ${res.statusCode} for ${req.method} ${req.path} from ${clientIP} in ${duration}ms`);
    }
    
    // Log des requêtes lentes (potentiel DoS)
    if (duration > 5000) {
      console.log(`[SECURITY] Slow request: ${req.method} ${req.path} from ${clientIP} took ${duration}ms`);
    }
  });

  next();
}

// Configuration complète de sécurité
export function setupSecurity(app: any) {
  // Appliquer tous les middlewares de sécurité
  app.use(securityHeaders);
  app.use(secureCORS);
  app.use(dosProtection);
  app.use(injectionProtection);
  app.use(securityLogging);
  
  console.log('[SECURITY] Headers de sécurité configurés');
}
