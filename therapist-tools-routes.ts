import type { Express, Request, Response } from "express";
import { db } from "./database";
import { 
  therapistNotes, 
  documentTemplates, 
  generatedDocuments, 
  therapistAbsences,
  type InsertTherapistNote,
  type InsertDocumentTemplate,
  type InsertGeneratedDocument,
  type InsertTherapistAbsence
} from "@shared/schema";
import { eq } from "drizzle-orm";

export function registerTherapistToolsRoutes(app: Express) {
  
  // ===== NOTES DE SÉANCE =====
  
  // Récupérer toutes les notes
  app.get("/api/therapist/notes", async (req: Request, res: Response) => {
    try {
      const notes = await db.select().from(therapistNotes).orderBy(therapistNotes.dateSession);
      res.json(notes);
    } catch (error) {
      console.error("Erreur lors de la récupération des notes:", error);
      res.status(500).json({ error: "Impossible de récupérer les notes" });
    }
  });

  // Créer une nouvelle note
  app.post("/api/therapist/notes", async (req: Request, res: Response) => {
    try {
      const noteData: InsertTherapistNote = req.body;
      
      // Validation basique
      if (!noteData.clientNom || !noteData.clientEmail || !noteData.titre || !noteData.contenu || !noteData.dateSession) {
        return res.status(400).json({ error: "Données manquantes" });
      }

      const [newNote] = await db.insert(therapistNotes).values({
        ...noteData,
        dateSession: new Date(noteData.dateSession),
      }).returning();
      
      res.json(newNote);
    } catch (error) {
      console.error("Erreur lors de la création de la note:", error);
      res.status(500).json({ error: "Impossible de créer la note" });
    }
  });

  // Modifier une note
  app.patch("/api/therapist/notes/:id", async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const updates = req.body;

      const [updatedNote] = await db
        .update(therapistNotes)
        .set({
          ...updates,
          updatedAt: new Date(),
          ...(updates.dateSession && { dateSession: new Date(updates.dateSession) }),
        })
        .where(eq(therapistNotes.id, id))
        .returning();

      if (!updatedNote) {
        return res.status(404).json({ error: "Note non trouvée" });
      }

      res.json(updatedNote);
    } catch (error) {
      console.error("Erreur lors de la mise à jour de la note:", error);
      res.status(500).json({ error: "Impossible de mettre à jour la note" });
    }
  });

  // Supprimer une note
  app.delete("/api/therapist/notes/:id", async (req: Request, res: Response) => {
    try {
      const { id } = req.params;

      await db.delete(therapistNotes).where(eq(therapistNotes.id, id));

      res.json({ success: true });
    } catch (error) {
      console.error("Erreur lors de la suppression de la note:", error);
      res.status(500).json({ error: "Impossible de supprimer la note" });
    }
  });

  // ===== MODÈLES DE DOCUMENTS =====
  
  // Récupérer tous les modèles de documents
  app.get("/api/therapist/document-templates", async (req: Request, res: Response) => {
    try {
      const templates = await db.select().from(documentTemplates).orderBy(documentTemplates.createdAt);
      res.json(templates);
    } catch (error) {
      console.error("Erreur lors de la récupération des modèles:", error);
      res.status(500).json({ error: "Impossible de récupérer les modèles" });
    }
  });

  // Créer un nouveau modèle
  app.post("/api/therapist/document-templates", async (req: Request, res: Response) => {
    try {
      const templateData: InsertDocumentTemplate = req.body;
      
      // Validation
      if (!templateData.nom || !templateData.type || !templateData.contenu) {
        return res.status(400).json({ error: "Données manquantes" });
      }

      const [newTemplate] = await db.insert(documentTemplates).values(templateData).returning();
      
      res.json(newTemplate);
    } catch (error) {
      console.error("Erreur lors de la création du modèle:", error);
      res.status(500).json({ error: "Impossible de créer le modèle" });
    }
  });

  // Modifier un modèle
  app.patch("/api/therapist/document-templates/:id", async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const updates = req.body;

      const [updatedTemplate] = await db
        .update(documentTemplates)
        .set({
          ...updates,
          updatedAt: new Date(),
        })
        .where(eq(documentTemplates.id, id))
        .returning();

      if (!updatedTemplate) {
        return res.status(404).json({ error: "Modèle non trouvé" });
      }

      res.json(updatedTemplate);
    } catch (error) {
      console.error("Erreur lors de la mise à jour du modèle:", error);
      res.status(500).json({ error: "Impossible de mettre à jour le modèle" });
    }
  });

  // Supprimer un modèle
  app.delete("/api/therapist/document-templates/:id", async (req: Request, res: Response) => {
    try {
      const { id } = req.params;

      await db.delete(documentTemplates).where(eq(documentTemplates.id, id));

      res.json({ success: true });
    } catch (error) {
      console.error("Erreur lors de la suppression du modèle:", error);
      res.status(500).json({ error: "Impossible de supprimer le modèle" });
    }
  });

  // ===== DOCUMENTS GÉNÉRÉS =====
  
  // Récupérer tous les documents générés
  app.get("/api/therapist/generated-documents", async (req: Request, res: Response) => {
    try {
      const documents = await db.select().from(generatedDocuments).orderBy(generatedDocuments.createdAt);
      res.json(documents);
    } catch (error) {
      console.error("Erreur lors de la récupération des documents:", error);
      res.status(500).json({ error: "Impossible de récupérer les documents" });
    }
  });

  // Générer un document à partir d'un modèle
  app.post("/api/therapist/generated-documents", async (req: Request, res: Response) => {
    try {
      const { templateId, clientEmail, clientNom, variables } = req.body;
      
      if (!templateId || !clientEmail || !clientNom) {
        return res.status(400).json({ error: "Données manquantes" });
      }

      // Récupérer le modèle
      const [template] = await db
        .select()
        .from(documentTemplates)
        .where(eq(documentTemplates.id, templateId));

      if (!template) {
        return res.status(404).json({ error: "Modèle non trouvé" });
      }

      // Remplacer les variables dans le contenu
      let contenuFinal = template.contenu;
      if (variables) {
        Object.keys(variables).forEach((key) => {
          const regex = new RegExp(`{{${key}}}`, 'g');
          contenuFinal = contenuFinal.replace(regex, variables[key]);
        });
      }

      // Créer le document généré
      const documentData: InsertGeneratedDocument = {
        templateId,
        clientEmail,
        clientNom,
        type: template.type,
        titre: `${template.nom} - ${clientNom}`,
        contenu: contenuFinal,
      };

      const [newDocument] = await db.insert(generatedDocuments).values(documentData).returning();
      
      res.json(newDocument);
    } catch (error) {
      console.error("Erreur lors de la génération du document:", error);
      res.status(500).json({ error: "Impossible de générer le document" });
    }
  });

  // Supprimer un document généré
  app.delete("/api/therapist/generated-documents/:id", async (req: Request, res: Response) => {
    try {
      const { id } = req.params;

      await db.delete(generatedDocuments).where(eq(generatedDocuments.id, id));

      res.json({ success: true });
    } catch (error) {
      console.error("Erreur lors de la suppression du document:", error);
      res.status(500).json({ error: "Impossible de supprimer le document" });
    }
  });

  // ===== ABSENCES =====
  
  // Récupérer toutes les absences
  app.get("/api/therapist/absences", async (req: Request, res: Response) => {
    try {
      const absences = await db.select().from(therapistAbsences).orderBy(therapistAbsences.dateDebut);
      res.json(absences);
    } catch (error) {
      console.error("Erreur lors de la récupération des absences:", error);
      res.status(500).json({ error: "Impossible de récupérer les absences" });
    }
  });

  // Vérifier la disponibilité pour une date donnée (pour le système de réservation)
  app.get("/api/therapist/check-availability", async (req: Request, res: Response) => {
    try {
      const { date } = req.query;
      
      if (!date) {
        return res.status(400).json({ error: "Date manquante" });
      }

      const requestedDate = new Date(date as string);

      // Récupérer toutes les absences qui bloquent les réservations
      const blockingAbsences = await db
        .select()
        .from(therapistAbsences)
        .where(eq(therapistAbsences.bloquerReservations, true));

      // Vérifier si la date demandée tombe dans une période d'absence
      const isBlocked = blockingAbsences.some(absence => {
        const start = new Date(absence.dateDebut);
        const end = new Date(absence.dateFin);
        return requestedDate >= start && requestedDate <= end;
      });

      res.json({ 
        isAvailable: !isBlocked,
        ...(isBlocked && { 
          message: blockingAbsences.find(a => {
            const start = new Date(a.dateDebut);
            const end = new Date(a.dateFin);
            return requestedDate >= start && requestedDate <= end;
          })?.messageAbsence || "Le thérapeute n'est pas disponible à cette date"
        })
      });
    } catch (error) {
      console.error("Erreur lors de la vérification de disponibilité:", error);
      res.status(500).json({ error: "Impossible de vérifier la disponibilité" });
    }
  });

  // Créer une nouvelle absence
  app.post("/api/therapist/absences", async (req: Request, res: Response) => {
    try {
      const absenceData: InsertTherapistAbsence = req.body;
      
      // Validation
      if (!absenceData.titre || !absenceData.dateDebut || !absenceData.dateFin || !absenceData.type) {
        return res.status(400).json({ error: "Données manquantes" });
      }

      // Vérifier que la date de fin est après la date de début
      if (new Date(absenceData.dateFin) < new Date(absenceData.dateDebut)) {
        return res.status(400).json({ error: "La date de fin doit être après la date de début" });
      }

      const [newAbsence] = await db.insert(therapistAbsences).values({
        ...absenceData,
        dateDebut: new Date(absenceData.dateDebut),
        dateFin: new Date(absenceData.dateFin),
      }).returning();
      
      res.json(newAbsence);
    } catch (error) {
      console.error("Erreur lors de la création de l'absence:", error);
      res.status(500).json({ error: "Impossible de créer l'absence" });
    }
  });

  // Modifier une absence
  app.patch("/api/therapist/absences/:id", async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const updates = req.body;

      const [updatedAbsence] = await db
        .update(therapistAbsences)
        .set({
          ...updates,
          updatedAt: new Date(),
          ...(updates.dateDebut && { dateDebut: new Date(updates.dateDebut) }),
          ...(updates.dateFin && { dateFin: new Date(updates.dateFin) }),
        })
        .where(eq(therapistAbsences.id, id))
        .returning();

      if (!updatedAbsence) {
        return res.status(404).json({ error: "Absence non trouvée" });
      }

      res.json(updatedAbsence);
    } catch (error) {
      console.error("Erreur lors de la mise à jour de l'absence:", error);
      res.status(500).json({ error: "Impossible de mettre à jour l'absence" });
    }
  });

  // Supprimer une absence
  app.delete("/api/therapist/absences/:id", async (req: Request, res: Response) => {
    try {
      const { id } = req.params;

      await db.delete(therapistAbsences).where(eq(therapistAbsences.id, id));

      res.json({ success: true });
    } catch (error) {
      console.error("Erreur lors de la suppression de l'absence:", error);
      res.status(500).json({ error: "Impossible de supprimer l'absence" });
    }
  });
}

