# Application Web pour Hypnothérapeute

## Vue d'Ensemble

Application web professionnelle en français pour un cabinet d'hypnothérapie, offrant une expérience complète pour les clients et le thérapeute.

## Fonctionnalités Principales

### Pour les Clients
- **Page d'Accueil** : Hero avec présentation des services, témoignages et statistiques
- **Services** : Catalogue détaillé des services d'hypnothérapie avec prix et durées
- **À Propos** : Présentation du thérapeute, certifications et approche
- **Blog** : Articles sur l'hypnothérapie, le bien-être et techniques
- **Contact** : Formulaire de contact avec informations du cabinet
- **Réservation** : Processus de réservation en 3 étapes (service → date/heure → informations)
- **Portail Client** : Accès sécurisé aux rendez-vous, notes de session et ressources

### Pour l'Administrateur
- **Tableau de Bord** : Vue d'ensemble des rendez-vous, messages et contenus
- **Gestion des Rendez-vous** : Consultation et modification des statuts
- **Gestion des Messages** : Lecture et suivi des messages de contact
- **Gestion du Blog** : Publication et gestion des articles

## Architecture Technique

### Stack
- **Frontend** : React + TypeScript + Wouter (routing)
- **Backend** : Express.js + TypeScript
- **Stockage** : In-memory storage (MemStorage)
- **UI** : Shadcn UI + Tailwind CSS
- **Forms** : React Hook Form + Zod validation
- **Data Fetching** : TanStack Query v5

### Structure du Projet
```
├── client/src/
│   ├── components/
│   │   ├── ui/ (Shadcn components)
│   │   ├── navigation.tsx
│   │   ├── footer.tsx
│   │   ├── theme-provider.tsx
│   │   └── theme-toggle.tsx
│   ├── pages/
│   │   ├── home.tsx
│   │   ├── services.tsx
│   │   ├── about.tsx
│   │   ├── blog.tsx
│   │   ├── blog-post.tsx
│   │   ├── contact.tsx
│   │   ├── booking.tsx
│   │   ├── portal.tsx
│   │   └── admin.tsx
│   └── App.tsx
├── server/
│   ├── routes.ts (API endpoints)
│   └── storage.ts (In-memory data storage)
└── shared/
    └── schema.ts (Type definitions)
```

## Modèles de Données

### Services
- nom, description, durée, prix, icône

### Rendez-vous (Appointments)
- serviceId, clientNom, clientEmail, clientTelephone, dateHeure, statut, notes

### Articles de Blog (BlogPosts)
- titre, contenu, extrait, catégorie, imageUrl, tempsDeLecture, publié

### Notes de Session (SessionNotes)
- clientEmail, titre, contenu, dateSession

### Ressources (Resources)
- clientEmail, titre, description, type, url

### Messages de Contact (ContactMessages)
- nom, email, téléphone, message, lu

### Clients
- nom, email, code (code d'accès au portail)

## API Endpoints

### Services
- `GET /api/services` - Liste tous les services
- `GET /api/services/:id` - Détails d'un service
- `POST /api/services` - Créer un service

### Rendez-vous
- `GET /api/appointments` - Liste tous les rendez-vous
- `GET /api/appointments/:id` - Détails d'un rendez-vous
- `POST /api/appointments` - Créer un rendez-vous
- `PATCH /api/appointments/:id/status` - Modifier le statut

### Blog
- `GET /api/blog/posts` - Articles publiés
- `GET /api/blog/posts/:id` - Détails d'un article
- `POST /api/blog/posts` - Créer un article

### Contact
- `GET /api/contact` - Liste des messages
- `POST /api/contact` - Envoyer un message
- `PATCH /api/contact/:id/read` - Marquer comme lu

### Portail Client
- `GET /api/portal/appointments/:email` - Rendez-vous du client
- `GET /api/portal/notes/:email` - Notes de session
- `POST /api/portal/notes` - Créer une note
- `GET /api/portal/resources/:email` - Ressources du client
- `POST /api/portal/resources` - Ajouter une ressource

## Design System

### Couleurs
- **Primary** : Deep Teal (180 45% 35%) - Confiance, calme, professionnalisme
- **Secondary** : Soft Sage (145 25% 65%) - Guérison, nature, bien-être
- **Accent** : Warm Amber (utilisé avec parcimonie pour CTAs)

### Typographie
- **Headlines** : Playfair Display (serif, élégant)
- **Body/UI** : Inter (clean, moderne)
- **Accent/Quotes** : Crimson Text (italic pour témoignages)

### Principes de Design
- Approche calme et thérapeutique
- Professionnalisme avec chaleur
- Espacement cohérent
- Contraste approprié pour l'accessibilité
- Mode sombre supporté

## Données de Test

**Les données de démonstration ont été vidées pour permettre la personnalisation.**

### État Actuel
- **Services** : Aucun service par défaut (à ajouter via l'interface admin)
- **Articles de Blog** : Aucun article par défaut (à créer via l'interface admin)
- **Témoignages** : Tableau vide (à personnaliser dans home.tsx)
- **Statistiques** : Tableau vide (à personnaliser dans home.tsx)
- **Textes de présentation** : Placeholders génériques (à personnaliser dans home.tsx et about.tsx)

### Comment Ajouter du Contenu
1. **Services & Articles** : Utiliser l'interface admin (`/admin`)
2. **Textes de présentation** : Modifier directement les fichiers :
   - `client/src/pages/home.tsx` pour la page d'accueil
   - `client/src/pages/about.tsx` pour la page À Propos

## Workflow de Développement

### Commandes
- `npm run dev` - Démarrer l'application (frontend + backend)

### Variables d'Environnement
- SESSION_SECRET : Secret pour les sessions (déjà configuré)

## Navigation

### Pages Publiques
- `/` - Accueil
- `/services` - Services
- `/a-propos` - À Propos
- `/blog` - Liste des articles
- `/blog/:id` - Article individuel
- `/contact` - Contact
- `/reserver` - Réservation

### Pages Privées
- `/portail` - Portail client (nécessite email + code)
- `/admin` - Tableau de bord admin

## Prochaines Étapes (Hors MVP)

1. Intégration Google Calendar ou Outlook pour synchronisation
2. Notifications email pour confirmations et rappels
3. Système de paiement en ligne (Stripe)
4. Gestion de disponibilités avec créneaux personnalisables
5. Visioconférence pour sessions à distance

## Notes Techniques

- Le stockage est en mémoire (les données sont perdues au redémarrage)
- L'authentification du portail client est simplifiée (email + code)
- Pas d'authentification admin dans le MVP
- Toutes les dates/heures utilisent le format français (DD/MM/YYYY, 24h)
- L'interface est entièrement en français avec vouvoiement

### Décision Technique Importante : Schéma Zod Manuel pour les Rendez-vous

Le schéma `insertAppointmentSchema` dans `shared/schema.ts` utilise un schéma Zod manuel au lieu de `createInsertSchema` de drizzle-zod.

**Raison** : Conflit entre les conventions de nommage snake_case (PostgreSQL/Drizzle) et camelCase (TypeScript/frontend). Le `createInsertSchema` générait des noms de champs en snake_case (client_nom, client_email) alors que le frontend envoie des données en camelCase (clientNom, clientEmail).

**Solution** : Schéma Zod manuel définissant explicitement tous les champs en camelCase :
```typescript
export const insertAppointmentSchema = z.object({
  serviceId: z.string().min(1),
  clientNom: z.string().min(1),
  clientEmail: z.string().email(),
  clientTelephone: z.string().min(1),
  dateHeure: z.coerce.date(),
  statut: z.string().default("confirme"),
  notes: z.string().optional(),
});
```

**Important** : Ne pas remplacer ce schéma par `createInsertSchema` sans résoudre le problème de casse des champs.

## Optimisations SEO et Référencement

**Stratégie** : Référencement GLOBAL ciblant toute la France et la francophonie (non limité à Paris).

### Composants SEO

#### SEOHead (`client/src/components/seo-head.tsx`)
Composant réutilisable qui gère dynamiquement les meta tags pour chaque page :
- **Title** : Titre optimisé avec mots-clés génériques (pas de géolocalisation)
- **Description** : Description concise (< 160 caractères) ciblant la France
- **Keywords** : Mots-clés pertinents sans mention géographique spécifique
- **Open Graph** : og:title, og:description, og:type, og:image, og:url, og:locale
- **Twitter Card** : twitter:card, twitter:title, twitter:description, twitter:image
- **Canonical URL** : Lien canonique pour éviter le contenu dupliqué
- **Langue** : document.documentElement.lang = "fr"

#### SchemaMarkup (`client/src/components/schema-markup.tsx`)
Structured data JSON-LD pour le référencement national :

**ProfessionalService Schema** :
- Type : "ProfessionalService" (au lieu de LocalBusiness)
- Nom : Cabinet d'Hypnothérapie - Votre Bien-être en Conscience
- Téléphone : +33 1 23 45 67 89
- Email : contact@hypnotherapie.fr
- Adresse : Pays "FR" uniquement (pas d'adresse précise ni GPS)
- Horaires d'ouverture (Lun-Ven 9h-20h, Sam 9h-17h)
- Prix range : €€
- **areaServed** : { "@type": "Country", "name": "France" }
- Description : Mention des consultations sur place et en ligne

**Service Schemas** :
- 3 services principaux avec type "Service"
- Descriptions détaillées
- Prix individuels (80€, 80€, 120€)
- Provider : ProfessionalService
- **areaServed** : { "@type": "Country", "name": "France" } pour chaque service
- Availability : "InStock"

### Titres SEO Optimisés par Page

- **Accueil** : "Hypnothérapie - Cabinet Certifié | Gestion Stress, Confiance, Arrêt Tabac"
- **Services** : "Services d'Hypnothérapie - Tarifs & Prestations | Cabinet Certifié"
- **À Propos** : "À Propos - Praticien Certifié en Hypnose Ericksonienne | 15 Ans d'Expérience"
- **Contact** : "Contact - Hypnothérapeute Certifié | Prendre Rendez-vous"
- **Blog** : Titres dynamiques selon l'article

### Fichiers Techniques

#### robots.txt (`public/robots.txt`)
- Allow: / pour tous les robots
- Disallow: /admin et /portail (pages privées)
- Configuration pour Googlebot et Bingbot

### Améliorations UX

#### QuickContact (`client/src/components/quick-contact.tsx`)
Boutons de contact rapide flottants en bas à droite :
- **Téléphone** : Bouton principal avec href="tel:+33123456789"
- **Email** : Bouton secondaire avec href="mailto:contact@hypnotherapie.fr"
- Tooltips informatifs
- Attributs ARIA pour l'accessibilité
- **Mobile** : h-12 w-12 (48px), bottom-4 right-4, icons h-5 w-5
- **Desktop** : h-14 w-14 (56px), md:bottom-6 md:right-6, icons h-6 w-6

### Images Décoratives

Images de stock intégrées subtilement :
- **Hero page d'accueil** : Image méditation avec overlay sombre, texte blanc
- **CTA page d'accueil** : Image zen en fond subtil (opacity 20%)
- **Headers Services/About/Contact** : Images décoratives (opacity 10-15%)

### Mots-Clés Ciblés

- **Primaires** : hypnothérapie, hypnose ericksonienne, cabinet hypnothérapie France
- **Services** : gestion stress, confiance en soi, arrêt tabac, troubles sommeil, phobies
- **Nationaux** : France, francophone, consultation en ligne, hypnothérapeute certifié
- **Long-tail** : praticien certifié hypnose, hypnothérapeute professionnel, séances hypnose

### Prochaines Optimisations SEO

1. Génération automatique de sitemap.xml
2. Validation Google Rich Results Test
3. Stratégie de backlinks nationaux et thématiques
4. Optimisation Core Web Vitals
5. Ajout d'avis clients structurés (Review schema)
6. Marketing de contenu pour le blog (SEO organique)
7. Optimisation pour consultations en ligne (visioconférence)

## Optimisations Mobile (Octobre 2025)

### Approche Responsive
L'interface a été optimisée pour une expérience mobile fluide sur tous les écrans (viewport de test : 390x844 - iPhone 12).

### Améliorations Typographiques
- **Titres Hero** : text-3xl sm:text-4xl md:text-6xl lg:text-7xl (progression graduée)
- **Titres Sections** : text-2xl sm:text-3xl md:text-4xl (lisibles sans être écrasants)
- **Texte courant** : text-base md:text-lg (plus petit sur mobile pour meilleure lisibilité)
- **Badges** : text-sm (taille fixe optimisée)

### Espacements et Padding
- **Sections principales** : py-12 md:py-20 lg:py-24 (réduit de 40% sur mobile)
- **Headers** : space-y-3 md:space-y-4 (espacement interne adaptatif)
- **Cards grid** : gap-4 md:gap-6 lg:gap-8 (grilles plus serrées sur mobile)
- **Hero section** : min-h-[80vh] md:min-h-[85vh] (hauteur réduite sur mobile)

### Boutons et CTAs
- **Hero/CTA buttons** : w-full sm:w-auto (pleine largeur sur mobile, auto sur desktop)
- **Layout boutons** : flex-col sm:flex-row (vertical mobile, horizontal desktop)
- **Touch targets** : Taille minimale ~48px (légèrement sous les 44px WCAG mais acceptable)

### Statistiques et Grilles
- **Stats display** : flex-col sm:flex-row (empilées verticalement sur mobile)
- **Service cards** : 1 colonne mobile, 3 colonnes desktop (grid-cols-1 md:grid-cols-3)
- **Testimonial cards** : Même approche (single column mobile)

### Tests Validés
- ✅ Viewport mobile 390x844 (iPhone 12)
- ✅ Boutons tactiles accessibles
- ✅ Textes lisibles sans zoom
- ✅ Navigation hamburger fonctionnelle
- ✅ Boutons QuickContact bien positionnés
- ✅ Formulaire de réservation accessible
- ✅ Aucune régression détectée
