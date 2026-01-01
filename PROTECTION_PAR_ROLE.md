# Protection par Rôle - Système d'Authentification

## 🔐 Système de Protection Implémenté

Le site dispose maintenant d'un système complet de protection par rôle qui garantit que chaque utilisateur n'accède qu'aux pages autorisées selon son rôle.

## 👥 Rôles Utilisateurs

### 1. **Client** (`role: "client"`)
- **Accès autorisé**: `/portail`
- **Description**: Portail client pour voir ses rendez-vous, notes de session et ressources
- **Fonctionnalités**:
  - Voir ses rendez-vous
  - Consulter ses notes de session
  - Accéder à ses ressources personnalisées
  - Réserver de nouvelles séances

### 2. **Thérapeute** (`role: "therapist"`)
- **Accès autorisé**: `/therapist-dashboard`
- **Description**: Tableau de bord pour gérer les clients et rendez-vous
- **Fonctionnalités**:
  - Gérer les rendez-vous
  - Voir la liste des clients
  - Gérer les messages
  - Créer des notes de session

### 3. **Administrateur** (`role: "admin"`)
- **Accès autorisé**: `/admin`
- **Description**: Panneau d'administration complet du site
- **Fonctionnalités**:
  - Configuration du site
  - Gestion des utilisateurs
  - Gestion du contenu
  - Statistiques et analytics

## 🛡️ Composant ProtectedRoute

### Utilisation

```tsx
<Route path="/portail">
  <ProtectedRoute allowedRoles={["client"]}>
    <Portal />
  </ProtectedRoute>
</Route>
```

### Paramètres

- **`allowedRoles`**: Array de rôles autorisés (`["admin", "therapist", "client"]`)
- **`requireAuth`**: Boolean (défaut: `true`) - nécessite authentification
- **`children`**: Composant à protéger

### Comportement

1. **Si l'utilisateur n'est pas connecté**:
   - Redirection automatique vers `/connexion`
   - Affichage d'un écran "Connexion Requise"
   - Boutons: "Se Connecter" et "Retour à l'Accueil"

2. **Si l'utilisateur est connecté mais n'a pas le bon rôle**:
   - Affichage d'un écran "Accès Refusé"
   - Indication du rôle actuel et du rôle requis
   - Boutons: "Aller à Mon Espace" et "Retour à l'Accueil"

3. **Si l'utilisateur a le bon rôle**:
   - Affichage du contenu protégé

## 🔄 Redirection Automatique

### Après Connexion

Quand un utilisateur se connecte, il est automatiquement redirigé vers sa page selon son rôle :

```typescript
const roleRoutes = {
  admin: "/admin",
  therapist: "/therapist-dashboard",
  client: "/portail"
};
```

### Délai de Redirection

- **2 secondes** après connexion réussie
- Permet à l'utilisateur de voir le message de succès
- Affichage d'un loader avec message personnalisé

### Messages de Redirection

- **Admin**: "Redirection vers le tableau de bord admin..."
- **Thérapeute**: "Redirection vers votre tableau de bord..."
- **Client**: "Redirection vers votre portail client..."

## 📋 Tableau des Routes

| Route | Accès Public | Client | Thérapeute | Admin |
|-------|-------------|--------|------------|-------|
| `/` | ✅ | ✅ | ✅ | ✅ |
| `/services` | ✅ | ✅ | ✅ | ✅ |
| `/a-propos` | ✅ | ✅ | ✅ | ✅ |
| `/blog` | ✅ | ✅ | ✅ | ✅ |
| `/contact` | ✅ | ✅ | ✅ | ✅ |
| `/reserver` | ✅ | ✅ | ✅ | ✅ |
| `/inscription` | ✅ | ✅ | ✅ | ✅ |
| `/connexion` | ✅ | ✅ | ✅ | ✅ |
| `/portail` | ❌ | ✅ | ❌ | ❌ |
| `/therapist-dashboard` | ❌ | ❌ | ✅ | ❌ |
| `/admin` | ❌ | ❌ | ❌ | ✅ |

## 🎨 Écrans de Protection

### 1. Connexion Requise

```
┌─────────────────────────────────┐
│                                 │
│         🔓 Icône Login          │
│                                 │
│      Connexion Requise          │
│                                 │
│  Vous devez être connecté pour  │
│  accéder à cette page           │
│                                 │
│  ┌───────────────────────────┐  │
│  │   Se Connecter            │  │
│  └───────────────────────────┘  │
│                                 │
│  ┌───────────────────────────┐  │
│  │   Retour à l'Accueil      │  │
│  └───────────────────────────┘  │
│                                 │
└─────────────────────────────────┘
```

### 2. Accès Refusé

```
┌─────────────────────────────────┐
│                                 │
│         🔒 Icône Lock           │
│                                 │
│        Accès Refusé             │
│                                 │
│  Vous n'avez pas les permissions│
│  nécessaires pour accéder à     │
│  cette page                     │
│                                 │
│  ┌───────────────────────────┐  │
│  │ Votre rôle: Client        │  │
│  │ Rôle requis: Thérapeute   │  │
│  └───────────────────────────┘  │
│                                 │
│  ┌───────────────────────────┐  │
│  │   Aller à Mon Espace      │  │
│  └───────────────────────────┘  │
│                                 │
│  ┌───────────────────────────┐  │
│  │   Retour à l'Accueil      │  │
│  └───────────────────────────┘  │
│                                 │
└─────────────────────────────────┘
```

### 3. Connexion Réussie

```
┌─────────────────────────────────┐
│                                 │
│      ✅ Icône animée            │
│                                 │
│    Connexion réussie !          │
│                                 │
│  Bienvenue, Jean Dupont         │
│                                 │
│  ┌───────────────────────────┐  │
│  │ Connecté en tant que:     │  │
│  │ Client                    │  │
│  └───────────────────────────┘  │
│                                 │
│  ⏳ Redirection vers votre      │
│     portail client...           │
│                                 │
└─────────────────────────────────┘
```

## 🔧 Fonctions Utilitaires

### `getDefaultRouteForRole(role)`

Retourne la route par défaut pour un rôle donné.

```typescript
getDefaultRouteForRole("client")      // → "/portail"
getDefaultRouteForRole("therapist")   // → "/therapist-dashboard"
getDefaultRouteForRole("admin")       // → "/admin"
```

### `redirectToDefaultRoute(role)`

Redirige immédiatement vers la route par défaut du rôle.

```typescript
redirectToDefaultRoute(user.role);
```

## 🧪 Tests de Protection

### Scénario 1: Client essaie d'accéder au dashboard thérapeute

1. ✅ Client se connecte avec succès
2. ✅ Redirection automatique vers `/portail`
3. ❌ Client essaie d'aller sur `/therapist-dashboard`
4. ✅ Écran "Accès Refusé" s'affiche
5. ✅ Bouton "Aller à Mon Espace" → `/portail`

### Scénario 2: Thérapeute essaie d'accéder à l'admin

1. ✅ Thérapeute se connecte avec succès
2. ✅ Redirection automatique vers `/therapist-dashboard`
3. ❌ Thérapeute essaie d'aller sur `/admin`
4. ✅ Écran "Accès Refusé" s'affiche
5. ✅ Bouton "Aller à Mon Espace" → `/therapist-dashboard`

### Scénario 3: Utilisateur non connecté essaie d'accéder à une page protégée

1. ❌ Utilisateur pas connecté
2. ❌ Essaie d'aller sur `/portail`
3. ✅ Écran "Connexion Requise" s'affiche
4. ✅ Bouton "Se Connecter" → `/connexion`

### Scénario 4: Admin se connecte

1. ✅ Admin se connecte avec succès
2. ✅ Message "Connecté en tant que: Administrateur"
3. ✅ Redirection automatique vers `/admin` après 2 secondes

## 📱 Responsive

Tous les écrans de protection sont **100% responsive** :
- Mobile (< 768px)
- Tablette (768px - 1024px)
- Desktop (> 1024px)

## 🎨 Animations

### Écran de Succès
- ✅ Icône CheckCircle avec `animate-pulse`
- ✅ Effet `animate-ping` en arrière-plan
- ✅ Loader rotatif pendant la redirection

### Transitions
- Smooth transitions entre les états
- Messages clairs et conviviaux
- Feedback visuel immédiat

## 🔒 Sécurité

### Protection Côté Client
- ✅ Vérification du rôle avant affichage
- ✅ Redirection automatique si non autorisé
- ✅ State management sécurisé

### Protection Côté Serveur (À FAIRE)
⚠️ **Important**: Il faut également protéger les routes API côté serveur !

```typescript
// Exemple à implémenter dans server/middleware/auth.ts
export function requireRole(allowedRoles: UserRole[]) {
  return (req, res, next) => {
    const user = req.user;
    if (!user || !allowedRoles.includes(user.role)) {
      return res.status(403).json({ error: "Accès refusé" });
    }
    next();
  };
}
```

## 📝 Comptes de Test

Pour tester la protection par rôle, utilisez ces comptes :

### Admin
- Email: `admin@hypnotherapie.fr`
- Mot de passe: `admin123`
- Redirection: `/admin`

### Thérapeute
- Email: `therapist@hypnotherapie.fr`
- Mot de passe: `therapist123`
- Redirection: `/therapist-dashboard`

### Client
- Email: `client@hypnotherapie.fr`
- Mot de passe: `client123`
- Redirection: `/portail`

## ✅ Checklist de Sécurité

- [x] Protection par rôle côté client
- [x] Redirection automatique après login
- [x] Écrans de blocage élégants
- [x] Messages d'erreur clairs
- [x] Responsive sur tous les écrans
- [ ] Protection API côté serveur (À FAIRE)
- [ ] Tests E2E de la protection (À FAIRE)
- [ ] Logs d'audit des tentatives d'accès (À FAIRE)

## 🚀 Résumé

Le système de protection par rôle est maintenant **100% fonctionnel** côté client :

✅ **3 rôles distincts** (Admin, Thérapeute, Client)
✅ **Routes protégées** avec ProtectedRoute
✅ **Redirection automatique** selon le rôle
✅ **Écrans d'erreur élégants** et conviviaux
✅ **Animations fluides** et modernes
✅ **100% responsive** sur tous les appareils

**Le thérapeute n'a plus accès au portail client !** 🎉







