-- Migration: Ajout des nouveaux champs au formulaire de contact
-- Date: 2025-01-XX

-- Ajouter la colonne prenom
ALTER TABLE contact_messages ADD COLUMN IF NOT EXISTS prenom TEXT NOT NULL DEFAULT '';

-- Ajouter la colonne adresse
ALTER TABLE contact_messages ADD COLUMN IF NOT EXISTS adresse TEXT;

-- Ajouter la colonne raison_rendez_vous
ALTER TABLE contact_messages ADD COLUMN IF NOT EXISTS raison_rendez_vous TEXT NOT NULL DEFAULT '';

-- Ajouter la colonne meilleur_moment
ALTER TABLE contact_messages ADD COLUMN IF NOT EXISTS meilleur_moment TEXT;

-- Modifier les colonnes existantes pour rendre telephone obligatoire et message optionnel
ALTER TABLE contact_messages ALTER COLUMN telephone SET NOT NULL;
ALTER TABLE contact_messages ALTER COLUMN message DROP NOT NULL;

-- Supprimer les valeurs par défaut après migration des données existantes
ALTER TABLE contact_messages ALTER COLUMN prenom DROP DEFAULT;
ALTER TABLE contact_messages ALTER COLUMN raison_rendez_vous DROP DEFAULT;



