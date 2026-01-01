// Script pour créer le premier utilisateur admin
import { db } from './database';
import { users } from '@shared/schema';
import { hashPassword } from './auth-server';
import { eq } from 'drizzle-orm';

async function createFirstAdmin() {
  try {
    console.log('Création du premier utilisateur admin...');

    // Vérifier s'il existe déjà un admin
    const existingAdmin = await db.select().from(users)
      .where(eq(users.role, 'admin'))
      .limit(1);

    if (existingAdmin.length > 0) {
      console.log('Un administrateur existe déjà.');
      return;
    }

    // Créer le premier admin
    const adminPassword = await hashPassword('admin123'); // Changez ce mot de passe !
    
    const admin = await db.insert(users).values({
      email: 'admin@hypnotherapie.fr',
      password: adminPassword,
      nom: 'Administrateur Principal',
      role: 'admin',
      isActive: true,
      emailVerified: true, // Marquer comme vérifié pour le premier admin
    }).returning();

    console.log('✅ Premier administrateur créé avec succès !');
    console.log('Email: ninjaquentin22@gmail.com');
    console.log('Mot de passe: admin123');
    console.log('⚠️  IMPORTANT: Changez ce mot de passe immédiatement !');
    console.log('ID utilisateur:', admin[0].id);

  } catch (error) {
    console.error('❌ Erreur lors de la création de l\'admin:', error);
  }
}

// Exécuter le script
if (require.main === module) {
  createFirstAdmin()
    .then(() => process.exit(0))
    .catch((error) => {
      console.error(error);
      process.exit(1);
    });
}

export { createFirstAdmin };