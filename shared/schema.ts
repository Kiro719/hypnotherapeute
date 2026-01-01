import { sql } from "drizzle-orm";
import { pgTable, text, varchar, timestamp, integer, boolean, uuid } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Services d'hypnothérapie
export const services = pgTable("services", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  nom: text("nom").notNull(),
  description: text("description").notNull(),
  duree: integer("duree").notNull(), // en minutes
  prix: integer("prix").notNull(), // en centimes d'euros
  icone: text("icone").notNull(), // nom de l'icône lucide-react
});

export const insertServiceSchema = createInsertSchema(services).omit({ id: true });
export type InsertService = z.infer<typeof insertServiceSchema>;
export type Service = typeof services.$inferSelect;

// Rendez-vous
export const appointments = pgTable("appointments", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  serviceId: varchar("service_id").notNull(),
  clientNom: text("client_nom").notNull(),
  clientEmail: text("client_email").notNull(),
  clientTelephone: text("client_telephone").notNull(),
  dateHeure: timestamp("date_heure").notNull(),
  statut: text("statut").notNull().default("confirme"), // confirme, annule, termine
  notes: text("notes"),
  createdAt: timestamp("created_at").notNull().default(sql`now()`),
});

export const insertAppointmentSchema = z.object({
  serviceId: z.string().min(1),
  clientNom: z.string().min(1),
  clientEmail: z.string().email(),
  clientTelephone: z.string().min(1),
  dateHeure: z.coerce.date(),
  statut: z.string().default("confirme"),
  notes: z.string().optional(),
});
export type InsertAppointment = z.infer<typeof insertAppointmentSchema>;
export type Appointment = typeof appointments.$inferSelect;

// Articles de blog
export const blogPosts = pgTable("blog_posts", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  titre: text("titre").notNull(),
  contenu: text("contenu").notNull(),
  extrait: text("extrait").notNull(),
  categorie: text("categorie").notNull(),
  imageUrl: text("image_url"),
  tempsDeLecture: integer("temps_de_lecture").notNull(), // en minutes
  publie: boolean("publie").notNull().default(false),
  createdAt: timestamp("created_at").notNull().default(sql`now()`),
});

export const insertBlogPostSchema = createInsertSchema(blogPosts).omit({ 
  id: true, 
  createdAt: true 
});
export type InsertBlogPost = z.infer<typeof insertBlogPostSchema>;
export type BlogPost = typeof blogPosts.$inferSelect;

// Notes de session (pour le portail client)
export const sessionNotes = pgTable("session_notes", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  clientEmail: text("client_email").notNull(),
  titre: text("titre").notNull(),
  contenu: text("contenu").notNull(),
  dateSession: timestamp("date_session").notNull(),
  createdAt: timestamp("created_at").notNull().default(sql`now()`),
});

export const insertSessionNoteSchema = createInsertSchema(sessionNotes).omit({ 
  id: true, 
  createdAt: true 
});
export type InsertSessionNote = z.infer<typeof insertSessionNoteSchema>;
export type SessionNote = typeof sessionNotes.$inferSelect;

// Ressources pour clients
export const resources = pgTable("resources", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  clientEmail: text("client_email").notNull(),
  titre: text("titre").notNull(),
  description: text("description").notNull(),
  type: text("type").notNull(), // audio, video, pdf, lien
  url: text("url").notNull(),
  createdAt: timestamp("created_at").notNull().default(sql`now()`),
});

export const insertResourceSchema = createInsertSchema(resources).omit({ 
  id: true, 
  createdAt: true 
});
export type InsertResource = z.infer<typeof insertResourceSchema>;
export type Resource = typeof resources.$inferSelect;

// Messages de contact
export const contactMessages = pgTable("contact_messages", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  nom: text("nom").notNull(),
  prenom: text("prenom").notNull(),
  email: text("email").notNull(),
  telephone: text("telephone").notNull(),
  adresse: text("adresse"),
  raisonRendezVous: text("raison_rendez_vous").notNull(),
  meilleurMoment: text("meilleur_moment"),
  message: text("message"),
  lu: boolean("lu").notNull().default(false),
  createdAt: timestamp("created_at").notNull().default(sql`now()`),
});

export const insertContactMessageSchema = createInsertSchema(contactMessages).omit({ 
  id: true, 
  createdAt: true,
  lu: true 
});
export type InsertContactMessage = z.infer<typeof insertContactMessageSchema>;
export type ContactMessage = typeof contactMessages.$inferSelect;

// Client credentials pour accès au portail
export const clients = pgTable("clients", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  nom: text("nom").notNull(),
  email: text("email").notNull().unique(),
  code: text("code").notNull(), // code d'accès simple
  createdAt: timestamp("created_at").notNull().default(sql`now()`),
});

export const insertClientSchema = createInsertSchema(clients).omit({ 
  id: true, 
  createdAt: true 
});
export type InsertClient = z.infer<typeof insertClientSchema>;
export type Client = typeof clients.$inferSelect;

// ===== SYSTÈME D'AUTHENTIFICATION =====

// Table des utilisateurs
export const users = pgTable("users", {
  id: uuid("id").primaryKey().default(sql`gen_random_uuid()`),
  email: text("email").notNull().unique(),
  password: text("password").notNull(), // Hashé avec bcrypt
  nom: text("nom").notNull(),
  telephone: text("telephone"),
  role: text("role").notNull().default("client"), // admin, therapist, client
  isActive: boolean("is_active").notNull().default(true),
  createdAt: timestamp("created_at").notNull().default(sql`now()`),
  lastLogin: timestamp("last_login"),
  // Champs optionnels pour plus de sécurité
  emailVerified: boolean("email_verified").notNull().default(false),
  resetPasswordToken: text("reset_password_token"),
  resetPasswordExpires: timestamp("reset_password_expires"),
});

// Table des sessions (optionnel, pour gérer les sessions côté serveur)
export const sessions = pgTable("sessions", {
  id: uuid("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: uuid("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  token: text("token").notNull().unique(),
  expiresAt: timestamp("expires_at").notNull(),
  createdAt: timestamp("created_at").notNull().default(sql`now()`),
  userAgent: text("user_agent"),
  ipAddress: text("ip_address"),
});

// Types TypeScript pour l'authentification
export const insertUserSchema = createInsertSchema(users).omit({ 
  id: true, 
  createdAt: true,
  lastLogin: true,
  emailVerified: true,
  resetPasswordToken: true,
  resetPasswordExpires: true
});
export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

export const insertSessionSchema = createInsertSchema(sessions).omit({ 
  id: true, 
  createdAt: true 
});
export type InsertSession = z.infer<typeof insertSessionSchema>;
export type Session = typeof sessions.$inferSelect;

// ===== OUTILS THÉRAPEUTE =====

// Notes de séance du thérapeute (privées, pour usage interne)
export const therapistNotes = pgTable("therapist_notes", {
  id: uuid("id").primaryKey().default(sql`gen_random_uuid()`),
  appointmentId: varchar("appointment_id").references(() => appointments.id, { onDelete: "cascade" }),
  clientEmail: text("client_email").notNull(),
  clientNom: text("client_nom").notNull(),
  titre: text("titre").notNull(),
  contenu: text("contenu").notNull(),
  objectifs: text("objectifs"), // Objectifs de la séance
  observations: text("observations"), // Observations du thérapeute
  recommandations: text("recommandations"), // Recommandations pour le suivi
  tags: text("tags"), // Tags séparés par des virgules pour faciliter la recherche
  isPrivate: boolean("is_private").notNull().default(true), // Notes privées du thérapeute
  dateSession: timestamp("date_session").notNull(),
  createdAt: timestamp("created_at").notNull().default(sql`now()`),
  updatedAt: timestamp("updated_at").notNull().default(sql`now()`),
});

export const insertTherapistNoteSchema = createInsertSchema(therapistNotes).omit({ 
  id: true, 
  createdAt: true,
  updatedAt: true
});
export type InsertTherapistNote = z.infer<typeof insertTherapistNoteSchema>;
export type TherapistNote = typeof therapistNotes.$inferSelect;

// Modèles de documents (attestations, factures, etc.)
export const documentTemplates = pgTable("document_templates", {
  id: uuid("id").primaryKey().default(sql`gen_random_uuid()`),
  nom: text("nom").notNull(),
  type: text("type").notNull(), // attestation, facture, questionnaire, bilan
  contenu: text("contenu").notNull(), // HTML template avec variables {{nom}}, {{date}}, etc.
  description: text("description"),
  isActive: boolean("is_active").notNull().default(true),
  createdAt: timestamp("created_at").notNull().default(sql`now()`),
  updatedAt: timestamp("updated_at").notNull().default(sql`now()`),
});

export const insertDocumentTemplateSchema = createInsertSchema(documentTemplates).omit({ 
  id: true, 
  createdAt: true,
  updatedAt: true
});
export type InsertDocumentTemplate = z.infer<typeof insertDocumentTemplateSchema>;
export type DocumentTemplate = typeof documentTemplates.$inferSelect;

// Documents générés à partir des modèles
export const generatedDocuments = pgTable("generated_documents", {
  id: uuid("id").primaryKey().default(sql`gen_random_uuid()`),
  templateId: uuid("template_id").references(() => documentTemplates.id),
  clientEmail: text("client_email").notNull(),
  clientNom: text("client_nom").notNull(),
  appointmentId: varchar("appointment_id").references(() => appointments.id),
  type: text("type").notNull(), // attestation, facture, questionnaire, bilan
  titre: text("titre").notNull(),
  contenu: text("contenu").notNull(), // HTML final avec variables remplacées
  fileName: text("file_name"), // Nom du fichier PDF généré
  createdAt: timestamp("created_at").notNull().default(sql`now()`),
});

export const insertGeneratedDocumentSchema = createInsertSchema(generatedDocuments).omit({ 
  id: true, 
  createdAt: true
});
export type InsertGeneratedDocument = z.infer<typeof insertGeneratedDocumentSchema>;
export type GeneratedDocument = typeof generatedDocuments.$inferSelect;

// Absences et congés du thérapeute
export const therapistAbsences = pgTable("therapist_absences", {
  id: uuid("id").primaryKey().default(sql`gen_random_uuid()`),
  titre: text("titre").notNull(), // Ex: "Congés d'été", "Formation", "Maladie"
  description: text("description"),
  dateDebut: timestamp("date_debut").notNull(),
  dateFin: timestamp("date_fin").notNull(),
  type: text("type").notNull(), // conges, formation, maladie, autre
  messageAbsence: text("message_absence"), // Message personnalisé affiché aux clients
  bloquerReservations: boolean("bloquer_reservations").notNull().default(true),
  createdAt: timestamp("created_at").notNull().default(sql`now()`),
  updatedAt: timestamp("updated_at").notNull().default(sql`now()`),
});

export const insertTherapistAbsenceSchema = createInsertSchema(therapistAbsences).omit({ 
  id: true, 
  createdAt: true,
  updatedAt: true
});
export type InsertTherapistAbsence = z.infer<typeof insertTherapistAbsenceSchema>;
export type TherapistAbsence = typeof therapistAbsences.$inferSelect;
