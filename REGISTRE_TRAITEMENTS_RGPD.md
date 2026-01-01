# Registre des Traitements de Données Personnelles (RGPD)

**Cabinet d'Hypnothérapie**  
**Date de création** : 21 octobre 2024  
**Dernière mise à jour** : 21 octobre 2024  
**Responsable** : Responsable du traitement  
**DPO (Délégué à la Protection des Données)** : dpo@hypnotherapie.fr

---

## 1. GESTION DES CLIENTS ET RENDEZ-VOUS

### Finalité du traitement
Gestion des prises de rendez-vous, suivi des clients et historique des consultations

### Base légale
- Exécution du contrat (Article 6.1.b RGPD)
- Consentement de la personne concernée (Article 6.1.a RGPD)

### Catégories de données collectées
- **Données d'identification** : nom, prénom, email, téléphone
- **Données de rendez-vous** : date, heure, service choisi, notes de consultation
- **Données de santé** : objectifs thérapeutiques, antécédents (si pertinent)
- **Données de connexion** : logs de connexion, IP, user-agent

### Catégories de personnes concernées
- Clients actuels
- Anciens clients
- Prospects

### Destinataires des données
- Personnel du cabinet (thérapeute, assistant)
- Hébergeur du site web (serveur sécurisé)
- Prestataire de paiement (Stripe)

### Transferts hors UE
**NON** - Toutes les données sont stockées en France/UE

### Durée de conservation
- **Données clients actifs** : Durée de la relation contractuelle + 3 ans
- **Données de santé** : 10 ans après la dernière consultation (obligation légale)
- **Logs de connexion** : 12 mois

### Mesures de sécurité
- Chiffrement des données en transit (HTTPS/SSL)
- Mots de passe hashés (bcrypt)
- Authentification à deux facteurs (2FA) disponible
- Logs d'activité et détection d'anomalies
- Sauvegardes quotidiennes chiffrées
- Accès restreint par rôles (RBAC)

---

## 2. AUTHENTIFICATION ET GESTION DES COMPTES

### Finalité du traitement
Authentification sécurisée des utilisateurs et gestion des comptes

### Base légale
- Exécution du contrat (Article 6.1.b RGPD)
- Intérêt légitime pour la sécurité (Article 6.1.f RGPD)

### Catégories de données collectées
- **Données de compte** : email, nom, mot de passe (hashé), rôle (client/thérapeute/admin)
- **Données de sécurité** : secret 2FA, codes de secours, tentatives de connexion
- **Logs d'activité** : actions effectuées, IP, timestamps

### Durée de conservation
- **Comptes actifs** : Durée d'utilisation du service
- **Comptes inactifs** : Suppression après 3 ans sans activité
- **Logs de sécurité** : 12 mois

### Mesures de sécurité
- Hachage des mots de passe (bcrypt, cost factor 12)
- 2FA optionnelle (TOTP)
- Détection des activités suspectes
- Limitation du taux de tentatives de connexion

---

## 3. NEWSLETTERS ET COMMUNICATIONS MARKETING

### Finalité du traitement
Envoi de newsletters, offres promotionnelles et communications marketing

### Base légale
**Consentement explicite** (Article 6.1.a RGPD)

### Catégories de données collectées
- Email
- Prénom
- Préférences de communication
- Statistiques d'ouverture et de clics

### Durée de conservation
- **Abonnés actifs** : Jusqu'au désabonnement
- **Désabonnés** : Suppression immédiate de la liste de diffusion

### Mesures de sécurité
- Double opt-in (confirmation par email)
- Lien de désabonnement dans chaque email
- Gestion des préférences de consentement

---

## 4. COOKIES ET TRACEURS

### Finalité du traitement
Amélioration de l'expérience utilisateur, statistiques de visite, personnalisation

### Base légale
**Consentement** (Article 6.1.a RGPD + Directive ePrivacy)

### Types de cookies
1. **Cookies essentiels** (non soumis au consentement) :
   - Session utilisateur
   - Panier de réservation
   - Préférences de langue/thème

2. **Cookies analytiques** (soumis au consentement) :
   - Google Analytics (anonymisé)
   - Statistiques de navigation

3. **Cookies marketing** (soumis au consentement) :
   - Personnalisation du contenu
   - Suivi des campagnes

### Durée de conservation
- **Cookies de session** : Fin de session
- **Cookies persistants** : Maximum 13 mois

### Mesures de sécurité
- Bandeau de consentement explicite
- Gestion granulaire des préférences
- Possibilité de retirer le consentement à tout moment

---

## 5. PAIEMENTS EN LIGNE

### Finalité du traitement
Traitement des paiements pour les consultations

### Base légale
- Exécution du contrat (Article 6.1.b RGPD)
- Obligations légales comptables (Article 6.1.c RGPD)

### Catégories de données collectées
- **Données de transaction** : montant, date, référence
- **Données bancaires** : **NON stockées** (gérées par Stripe PCI-DSS)

### Destinataires
- **Stripe** (processeur de paiement certifié PCI-DSS)

### Durée de conservation
- **Données de transaction** : 10 ans (obligations comptables)
- **Données bancaires** : **Jamais stockées** localement

### Mesures de sécurité
- Utilisation de Stripe (certifié PCI-DSS niveau 1)
- Aucune donnée bancaire stockée localement
- Tokenisation des moyens de paiement

---

## 6. LOGS D'ACTIVITÉ ET SÉCURITÉ

### Finalité du traitement
Audit de sécurité, détection d'intrusions, conformité RGPD

### Base légale
- Intérêt légitime pour la sécurité (Article 6.1.f RGPD)
- Obligations légales (Article 6.1.c RGPD)

### Catégories de données collectées
- Adresse IP
- User-agent (navigateur)
- Actions effectuées
- Timestamps
- Résultat des actions (succès/échec)

### Durée de conservation
- **Logs standards** : 12 mois
- **Logs d'incidents de sécurité** : 36 mois

### Mesures de sécurité
- Accès restreint (admin uniquement)
- Logs chiffrés en base de données
- Détection automatique d'anomalies

---

## 7. EXERCICE DES DROITS DES PERSONNES CONCERNÉES

### Droits disponibles
Les personnes concernées disposent des droits suivants :

#### 1. Droit d'accès (Article 15 RGPD)
- Consultation de toutes ses données personnelles
- Accessible via le portail client : section "Mes Données"

#### 2. Droit de rectification (Article 16 RGPD)
- Modification des données inexactes
- Accessible via le profil utilisateur

#### 3. Droit à l'effacement / Droit à l'oubli (Article 17 RGPD)
- Suppression définitive du compte et des données
- Accessible via : "Paramètres > Sécurité > Supprimer mon compte"
- Délai d'exécution : 30 jours maximum

#### 4. Droit à la portabilité (Article 20 RGPD)
- Export de toutes les données au format JSON
- Accessible via : "Mes Données > Exporter mes données"

#### 5. Droit d'opposition (Article 21 RGPD)
- Refus du traitement à des fins marketing
- Désabonnement newsletter : lien dans chaque email

#### 6. Droit de limitation du traitement (Article 18 RGPD)
- Gel temporaire du traitement
- Demande à effectuer par email : contact@hypnotherapie.fr

### Délais de réponse
- **1 mois** maximum pour répondre aux demandes
- Prolongation possible de 2 mois si complexité (avec justification)

### Contact pour l'exercice des droits
- **Email** : dpo@hypnotherapie.fr
- **Courrier** : [Adresse du cabinet]
- **Formulaire en ligne** : disponible sur le site

---

## 8. VIOLATION DE DONNÉES (DATA BREACH)

### Procédure en cas de violation
1. **Détection** : Alertes automatiques + monitoring
2. **Évaluation** : Analyse de l'impact et des risques
3. **Notification CNIL** : Sous 72h si risque pour les droits des personnes
4. **Information des personnes** : Si risque élevé pour leurs droits
5. **Documentation** : Registre des violations tenu à jour

### Mesures préventives
- Sauvegardes quotidiennes
- Chiffrement des données sensibles
- Authentification forte (2FA)
- Logs d'audit
- Mises à jour de sécurité régulières

---

## 9. SOUS-TRAITANTS ET PARTENAIRES

### Liste des sous-traitants
| Sous-traitant | Service | Données traitées | Localisation | Garanties |
|---------------|---------|------------------|--------------|-----------|
| **Stripe** | Paiement | Données de transaction | UE/USA | PCI-DSS, Privacy Shield |
| **Hébergeur** | Hébergement web | Toutes données | France/UE | Certification ISO 27001 |
| **Email Provider** | Emails transactionnels | Email, nom | UE | Contrat DPA |

### Obligations des sous-traitants
- Signature d'un **contrat de sous-traitance RGPD** (Article 28)
- Garanties de sécurité équivalentes
- Interdiction de sous-traiter sans autorisation
- Assistance en cas d'exercice de droits
- Notification obligatoire des violations

---

## 10. ANALYSE D'IMPACT (PIA/DPIA)

### Traitements nécessitant une PIA
- ✅ **Données de santé** : Analyse d'impact réalisée (confidentiel)
- ✅ **Logs de sécurité avec IP** : Analyse d'impact réalisée

### Résultat des analyses
- Risques **faibles à modérés** après mesures de sécurité
- Aucun traitement à risque élevé identifié

---

## 11. FORMATION ET SENSIBILISATION

### Personnel formé au RGPD
- ✅ Thérapeute principal
- ✅ Administrateur système
- ⏳ Personnel administratif (si embauche future)

### Fréquence de formation
- Formation initiale obligatoire
- Mise à jour annuelle
- Sensibilisation continue aux bonnes pratiques

---

## 12. RÉVISION ET MISE À JOUR

### Fréquence de révision
- **Revue annuelle** obligatoire du registre
- **Mise à jour immédiate** en cas de :
  - Nouveau traitement
  - Modification d'un traitement existant
  - Changement de sous-traitant
  - Évolution réglementaire

### Historique des versions
| Version | Date | Modifications |
|---------|------|---------------|
| 1.0 | 21/10/2024 | Création initiale |

---

## 13. CONTACT ET RÉCLAMATION

### Responsable de la protection des données (DPO)
- **Email** : dpo@hypnotherapie.fr
- **Réponse sous** : 5 jours ouvrés maximum

### Autorité de contrôle
En cas de réclamation non résolue, vous pouvez saisir la **CNIL** :
- **Site web** : https://www.cnil.fr
- **Adresse** : 3 Place de Fontenoy, TSA 80715, 75334 PARIS CEDEX 07
- **Téléphone** : 01 53 73 22 22

---

**Document confidentiel - Usage interne**  
**Dernière révision** : 21 octobre 2024







