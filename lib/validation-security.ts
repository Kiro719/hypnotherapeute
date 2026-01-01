// Schémas de validation Zod pour la sécurité
import { z } from 'zod';

// Schéma pour l'email avec validation stricte
const emailSchema = z.string()
  .email('Format d\'email invalide')
  .min(5, 'Email trop court')
  .max(254, 'Email trop long')
  .toLowerCase()
  .refine(email => {
    // Vérifier que l'email ne contient pas de caractères dangereux
    const dangerousChars = /[<>'"&]/;
    return !dangerousChars.test(email);
  }, 'Email contient des caractères non autorisés');

// Schéma pour le mot de passe sécurisé
const passwordSchema = z.string()
  .min(12, 'Le mot de passe doit contenir au moins 12 caractères')
  .max(128, 'Le mot de passe ne peut pas dépasser 128 caractères')
  .refine(password => {
    // Au moins une majuscule
    const hasUpperCase = /[A-Z]/.test(password);
    // Au moins une minuscule
    const hasLowerCase = /[a-z]/.test(password);
    // Au moins un chiffre
    const hasNumber = /\d/.test(password);
    // Au moins un caractère spécial
    const hasSpecial = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password);
    
    return hasUpperCase && hasLowerCase && hasNumber && hasSpecial;
  }, 'Le mot de passe doit contenir au moins une majuscule, une minuscule, un chiffre et un caractère spécial')
  .refine(password => {
    // Vérifier qu'il n'y a pas de séquences communes
    const commonSequences = ['123', 'abc', 'qwe', 'password', 'admin'];
    return !commonSequences.some(seq => password.toLowerCase().includes(seq));
  }, 'Le mot de passe contient des séquences trop communes');

// Schéma pour le nom (protection XSS)
const nameSchema = z.string()
  .min(2, 'Le nom doit contenir au moins 2 caractères')
  .max(50, 'Le nom ne peut pas dépasser 50 caractères')
  .regex(/^[a-zA-ZÀ-ÿ\s\-']+$/, 'Le nom ne peut contenir que des lettres, espaces, tirets et apostrophes')
  .refine(name => {
    // Vérifier qu'il n'y a pas de scripts malveillants
    const scriptPattern = /<script|javascript:|on\w+=/i;
    return !scriptPattern.test(name);
  }, 'Le nom contient des caractères non autorisés');

// Schéma pour le téléphone français
const phoneSchema = z.string()
  .regex(/^(\+33|0)[1-9](\d{8})$/, 'Format de téléphone français invalide')
  .refine(phone => {
    // Vérifier que ce n'est pas un numéro de test
    const testNumbers = ['0123456789', '0987654321', '0000000000'];
    return !testNumbers.includes(phone.replace(/[\s\-\.]/g, ''));
  }, 'Numéro de téléphone non autorisé');

// Schémas de validation pour l'authentification
export const loginSchema = z.object({
  email: emailSchema,
  password: z.string().min(1, 'Mot de passe requis')
});

export const registerSchema = z.object({
  nom: nameSchema,
  prenom: nameSchema,
  email: emailSchema,
  telephone: phoneSchema,
  password: passwordSchema,
  acceptNewsletter: z.boolean().optional()
});

// Schémas de validation pour les rendez-vous
export const appointmentSchema = z.object({
  serviceId: z.string().uuid('ID de service invalide'),
  clientNom: nameSchema,
  clientEmail: emailSchema,
  clientTelephone: phoneSchema,
  dateHeure: z.coerce.date()
    .refine(date => date > new Date(), 'La date doit être dans le futur')
    .refine(date => {
      // Vérifier que c'est dans les heures ouvrables (9h-18h)
      const hour = date.getHours();
      return hour >= 9 && hour <= 18;
    }, 'Les rendez-vous sont uniquement disponibles entre 9h et 18h'),
  notes: z.string()
    .max(500, 'Les notes ne peuvent pas dépasser 500 caractères')
    .optional()
    .refine(notes => {
      if (!notes) return true;
      // Vérifier qu'il n'y a pas de scripts malveillants
      const scriptPattern = /<script|javascript:|on\w+=/i;
      return !scriptPattern.test(notes);
    }, 'Les notes contiennent des caractères non autorisés')
});

// Schémas de validation pour les messages de contact
export const contactMessageSchema = z.object({
  nom: nameSchema,
  email: emailSchema,
  telephone: phoneSchema.optional(),
  message: z.string()
    .min(10, 'Le message doit contenir au moins 10 caractères')
    .max(1000, 'Le message ne peut pas dépasser 1000 caractères')
    .refine(message => {
      // Vérifier qu'il n'y a pas de scripts malveillants
      const scriptPattern = /<script|javascript:|on\w+=/i;
      return !scriptPattern.test(message);
    }, 'Le message contient des caractères non autorisés')
});

// Schémas de validation pour les articles de blog
export const blogPostSchema = z.object({
  titre: z.string()
    .min(5, 'Le titre doit contenir au moins 5 caractères')
    .max(100, 'Le titre ne peut pas dépasser 100 caractères')
    .refine(titre => {
      const scriptPattern = /<script|javascript:|on\w+=/i;
      return !scriptPattern.test(titre);
    }, 'Le titre contient des caractères non autorisés'),
  contenu: z.string()
    .min(50, 'Le contenu doit contenir au moins 50 caractères')
    .max(10000, 'Le contenu ne peut pas dépasser 10000 caractères'),
  extrait: z.string()
    .min(20, 'L\'extrait doit contenir au moins 20 caractères')
    .max(200, 'L\'extrait ne peut pas dépasser 200 caractères'),
  categorie: z.enum(['hypnose', 'bien-etre', 'stress', 'confiance', 'arret-tabac'], {
    errorMap: () => ({ message: 'Catégorie invalide' })
  }),
  imageUrl: z.string().url('URL d\'image invalide').optional(),
  tempsDeLecture: z.number()
    .int('Le temps de lecture doit être un nombre entier')
    .min(1, 'Le temps de lecture doit être d\'au moins 1 minute')
    .max(60, 'Le temps de lecture ne peut pas dépasser 60 minutes'),
  publie: z.boolean()
});

// Fonction utilitaire pour valider et nettoyer les données
export function validateAndSanitize<T>(schema: z.ZodSchema<T>, data: unknown): {
  success: boolean;
  data?: T;
  errors?: z.ZodError;
} {
  try {
    const validatedData = schema.parse(data);
    return { success: true, data: validatedData };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { success: false, errors: error };
    }
    throw error;
  }
}

// Middleware de validation pour Express
export function createValidationMiddleware<T>(schema: z.ZodSchema<T>) {
  return (req: any, res: any, next: any) => {
    const result = validateAndSanitize(schema, req.body);
    
    if (!result.success) {
      return res.status(400).json({
        error: 'Données de validation invalides',
        details: result.errors?.errors.map(err => ({
          field: err.path.join('.'),
          message: err.message
        }))
      });
    }
    
    req.validatedData = result.data;
    next();
  };
}

// Fonction pour nettoyer les données avant stockage
export function sanitizeForStorage(data: any): any {
  if (typeof data === 'string') {
    // Échapper les caractères HTML dangereux
    return data
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#x27;');
  }
  
  if (Array.isArray(data)) {
    return data.map(sanitizeForStorage);
  }
  
  if (data && typeof data === 'object') {
    const sanitized: any = {};
    for (const [key, value] of Object.entries(data)) {
      sanitized[key] = sanitizeForStorage(value);
    }
    return sanitized;
  }
  
  return data;
}
