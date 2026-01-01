// Configuration de l'administrateur principal
// Ce fichier contient les informations de l'admin principal du site

export const ADMIN_CONFIG = {
  // Remplacez cette adresse email par votre vraie adresse email
  email: "ninjaquentin22@gmail.com",
  
  // Mot de passe par défaut (vous devriez le changer après la première connexion)
  defaultPassword: "admin123",
  
  // Informations de contact
  nom: "Administrateur",
  telephone: "+33 1 23 45 67 89",
  
  // Configuration de sécurité
  security: {
    // Activer la double authentification (optionnel)
    twoFactorEnabled: false,
    
    // Durée de session en heures
    sessionDurationHours: 8,
    
    // Nombre maximum de tentatives de connexion
    maxLoginAttempts: 5,
    
    // Activer les logs de sécurité
    enableSecurityLogs: true,
  },
  
  // Permissions admin
  permissions: {
    canAccessAdmin: true,
    canManageUsers: true,
    canManageAppointments: true,
    canManageMessages: true,
    canManageBlog: true,
    canManageConfig: true,
    canViewAnalytics: true,
    canBookAppointments: true,
    canViewPublicContent: true,
  }
};

// Instructions pour configurer votre email admin :
/*
1. Remplacez "votre.email@exemple.fr" par votre vraie adresse email
2. Redémarrez le serveur pour appliquer les changements
3. Connectez-vous avec votre email et le mot de passe "admin123"
4. Changez immédiatement le mot de passe dans les paramètres admin
5. Configurez les autres paramètres selon vos besoins
*/
