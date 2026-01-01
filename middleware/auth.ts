import { Request, Response, NextFunction } from 'express';
import { storage } from '../storage';

// Interface pour les requêtes authentifiées
export interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
    email: string;
    role: string;
    isActive: boolean;
  };
}

// Middleware d'authentification
export function authenticateToken(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

  if (!token) {
    return res.status(401).json({ error: 'Token d\'accès requis' });
  }

  try {
    // Ici vous vérifieriez le JWT avec votre secret
    // Pour l'instant, on simule la vérification
    const user = storage.getUserByToken(token);
    if (!user) {
      return res.status(403).json({ error: 'Token invalide' });
    }

    req.user = user;
    next();
  } catch (error) {
    return res.status(403).json({ error: 'Token invalide' });
  }
}

// Middleware de vérification des rôles
export function requireRole(roles: string[]) {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({ error: 'Authentification requise' });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ error: 'Permissions insuffisantes' });
    }

    next();
  };
}

// Middleware de vérification des permissions spécifiques
export function requirePermission(permission: string) {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({ error: 'Authentification requise' });
    }

    const userPermissions = getPermissionsForRole(req.user.role);
    if (!userPermissions[permission as keyof typeof userPermissions]) {
      return res.status(403).json({ error: 'Permission insuffisante' });
    }

    next();
  };
}

// Définition des permissions par rôle (cohérent avec le frontend)
function getPermissionsForRole(role: string) {
  const permissions = {
    admin: {
      canAccessAdmin: true,
      canManageUsers: true,
      canManageAppointments: true,
      canManageMessages: true,
      canManageBlog: true,
      canManageConfig: true,
      canViewAnalytics: true,
      canBookAppointments: true,
      canViewPublicContent: true,
    },
    therapist: {
      canAccessAdmin: true,
      canManageUsers: false,
      canManageAppointments: true,
      canManageMessages: true,
      canManageBlog: false,
      canManageConfig: false,
      canViewAnalytics: false,
      canBookAppointments: true,
      canViewPublicContent: true,
    },
    client: {
      canAccessAdmin: false,
      canManageUsers: false,
      canManageAppointments: false,
      canManageMessages: false,
      canManageBlog: false,
      canManageConfig: false,
      canViewAnalytics: false,
      canBookAppointments: true,
      canViewPublicContent: true,
    },
    visitor: {
      canAccessAdmin: false,
      canManageUsers: false,
      canManageAppointments: false,
      canManageMessages: false,
      canManageBlog: false,
      canManageConfig: false,
      canViewAnalytics: false,
      canBookAppointments: false,
      canViewPublicContent: true,
    }
  };

  return permissions[role as keyof typeof permissions] || permissions.visitor;
}

// Middleware de logging pour audit RGPD
export function auditLog(action: string) {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    const originalSend = res.send;
    
    res.send = function(data) {
      // Log de l'action pour audit RGPD
      console.log(`[AUDIT] ${action}: ${req.user?.email || 'anonymous'} - ${req.method} ${req.path} - ${res.statusCode} - ${new Date().toISOString()}`);
      
      // Appeler la fonction send originale
      return originalSend.call(this, data);
    };
    
    next();
  };
}

// Middleware de validation des données sensibles
export function validateSensitiveData(req: Request, res: Response, next: NextFunction) {
  // Vérifier que les données sensibles ne sont pas exposées dans les logs
  const sensitiveFields = ['password', 'token', 'secret', 'key'];
  
  const logData = JSON.stringify(req.body);
  const hasSensitiveData = sensitiveFields.some(field => 
    logData.toLowerCase().includes(field.toLowerCase())
  );
  
  if (hasSensitiveData) {
    console.log(`[SECURITY] Sensitive data detected in request from ${req.ip} - ${new Date().toISOString()}`);
  }
  
  next();
}

// Middleware de limitation de taux (rate limiting)
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();

export function rateLimit(maxRequests: number = 100, windowMs: number = 15 * 60 * 1000) {
  return (req: Request, res: Response, next: NextFunction) => {
    const clientId = req.ip || 'unknown';
    const now = Date.now();
    
    const clientData = rateLimitMap.get(clientId);
    
    if (!clientData || now > clientData.resetTime) {
      rateLimitMap.set(clientId, { count: 1, resetTime: now + windowMs });
      return next();
    }
    
    if (clientData.count >= maxRequests) {
      console.log(`[SECURITY] Rate limit exceeded for ${clientId} - ${new Date().toISOString()}`);
      return res.status(429).json({ error: 'Trop de requêtes, veuillez réessayer plus tard' });
    }
    
    clientData.count++;
    next();
  };
}


