import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "@shared/schema";

// Configuration de la base de données
// La base de données est optionnelle - l'application peut fonctionner avec MemStorage en mémoire
const connectionString = process.env.DATABASE_URL || "postgresql://username:password@localhost:5432/hypnotherapie";

// Créer la connexion PostgreSQL de manière optionnelle
// Si DATABASE_URL n'est pas configuré ou invalide, on crée quand même une instance
// mais elle ne sera utilisée que si nécessaire
let client: ReturnType<typeof postgres> | null = null;
let dbInstance: ReturnType<typeof drizzle> | null = null;

try {
  // Seulement se connecter si DATABASE_URL est vraiment configuré
  if (process.env.DATABASE_URL && !process.env.DATABASE_URL.includes('username:password')) {
    client = postgres(connectionString);
    dbInstance = drizzle(client, { schema });
    console.log('[DATABASE] Connexion PostgreSQL activée');
  } else {
    console.log('[DATABASE] Mode mémoire activé (MemStorage) - Pas de base de données requise');
  }
} catch (error) {
  console.warn('[DATABASE] Impossible de se connecter à PostgreSQL, utilisation du mode mémoire:', error);
}

// Export de l'instance Drizzle (peut être null si DB non disponible)
export const db = dbInstance as ReturnType<typeof drizzle>;

// Fonction pour vérifier si la DB est disponible
export function isDatabaseAvailable(): boolean {
  return dbInstance !== null;
}

// Export des types pour l'authentification
export type { User, InsertUser, Session, InsertSession } from "@shared/schema";







