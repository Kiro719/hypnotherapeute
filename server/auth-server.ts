// Système d'authentification côté serveur
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { eq } from 'drizzle-orm';
import { db } from './database';
import { users, sessions } from '@shared/schema';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';
const JWT_EXPIRES_IN = '7d';

// Interface pour les données de connexion
interface LoginCredentials {
  email: string;
  password: string;
}

interface RegisterData {
  email: string;
  password: string;
  nom: string;
  role?: 'admin' | 'therapist' | 'client';
}

// Fonction pour hasher les mots de passe
export async function hashPassword(password: string): Promise<string> {
  const saltRounds = 12;
  return await bcrypt.hash(password, saltRounds);
}

// Fonction pour vérifier les mots de passe
export async function verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
  return await bcrypt.compare(password, hashedPassword);
}

// Fonction de connexion
export async function loginUser(credentials: LoginCredentials) {
  try {
    // 1. Vérifier que l'utilisateur existe
    const user = await db.select().from(users).where(eq(users.email, credentials.email)).limit(1);
    
    if (user.length === 0) {
      throw new Error('Email ou mot de passe incorrect');
    }

    const foundUser = user[0];

    // 2. Vérifier que le compte est actif
    if (!foundUser.isActive) {
      throw new Error('Compte désactivé');
    }

    // 3. Vérifier le mot de passe
    const isPasswordValid = await verifyPassword(credentials.password, foundUser.password);
    if (!isPasswordValid) {
      throw new Error('Email ou mot de passe incorrect');
    }

    // 4. Générer un token JWT
    const token = jwt.sign(
      { 
        userId: foundUser.id, 
        email: foundUser.email, 
        role: foundUser.role 
      },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRES_IN }
    );

    // 5. Mettre à jour la dernière connexion
    await db.update(users)
      .set({ lastLogin: new Date() })
      .where(eq(users.id, foundUser.id));

    // 6. Retourner les données utilisateur (sans le mot de passe)
    const { password, ...userWithoutPassword } = foundUser;
    
    return {
      success: true,
      user: userWithoutPassword,
      token
    };

  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Erreur de connexion'
    };
  }
}

// Fonction d'inscription
export async function registerUser(userData: RegisterData) {
  try {
    // 1. Vérifier que l'email n'existe pas déjà
    const existingUser = await db.select().from(users).where(eq(users.email, userData.email)).limit(1);
    
    if (existingUser.length > 0) {
      throw new Error('Cet email est déjà utilisé');
    }

    // 2. Hasher le mot de passe
    const hashedPassword = await hashPassword(userData.password);

    // 3. Créer l'utilisateur
    const newUser = await db.insert(users).values({
      email: userData.email,
      password: hashedPassword,
      nom: userData.nom,
      role: userData.role || 'client',
      isActive: true,
      emailVerified: false, // À vérifier par email
    }).returning();

    // 4. Retourner les données utilisateur (sans le mot de passe)
    const { password, ...userWithoutPassword } = newUser[0];
    
    return {
      success: true,
      user: userWithoutPassword
    };

  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Erreur lors de l\'inscription'
    };
  }
}

// Fonction pour vérifier un token JWT
export async function verifyToken(token: string) {
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as any;
    
    // Vérifier que l'utilisateur existe toujours et est actif
    const user = await db.select().from(users)
      .where(eq(users.id, decoded.userId))
      .limit(1);

    if (user.length === 0 || !user[0].isActive) {
      throw new Error('Utilisateur non trouvé ou inactif');
    }

    const { password, ...userWithoutPassword } = user[0];
    
    return {
      success: true,
      user: userWithoutPassword
    };

  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Token invalide'
    };
  }
}

// Middleware pour protéger les routes
export function requireAuth(req: any, res: any, next: any) {
  const token = req.headers.authorization?.replace('Bearer ', '');
  
  if (!token) {
    return res.status(401).json({ error: 'Token d\'authentification requis' });
  }

  verifyToken(token).then(result => {
    if (result.success) {
      req.user = result.user;
      next();
    } else {
      res.status(401).json({ error: result.error });
    }
  });
}

// Middleware pour vérifier les rôles
export function requireRole(allowedRoles: string[]) {
  return (req: any, res: any, next: any) => {
    if (!req.user) {
      return res.status(401).json({ error: 'Authentification requise' });
    }

    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({ error: 'Permissions insuffisantes' });
    }

    next();
  };
}