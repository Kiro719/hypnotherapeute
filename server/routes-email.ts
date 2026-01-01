// Routes API pour la gestion des emails
import type { Express } from "express";
import { emailService } from "./lib/email-service";
import { emailManager } from "./lib/email-manager";
import { emailCron } from "./lib/email-cron";

export function registerEmailRoutes(app: Express) {
  /**
   * Test de connexion SMTP
   * GET /api/emails/test-connection
   */
  app.get("/api/emails/test-connection", async (req, res) => {
    try {
      const isConnected = await emailService.verifyConnection();
      
      res.json({
        success: isConnected,
        message: isConnected 
          ? "Connexion SMTP réussie" 
          : "Échec de la connexion SMTP"
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: "Erreur lors du test de connexion"
      });
    }
  });

  /**
   * Envoyer un email de test
   * POST /api/emails/send-test
   * Body: { to: string, subject: string, html: string }
   */
  app.post("/api/emails/send-test", async (req, res) => {
    try {
      const { to, subject, html } = req.body;
      
      if (!to || !subject || !html) {
        return res.status(400).json({
          error: "Paramètres manquants: to, subject, html"
        });
      }

      const success = await emailService.sendEmail({
        to,
        subject,
        html,
      }, 'newsletter');

      res.json({
        success,
        message: success 
          ? "Email envoyé avec succès" 
          : "Échec de l'envoi de l'email"
      });
    } catch (error) {
      res.status(500).json({
        error: "Erreur lors de l'envoi de l'email"
      });
    }
  });

  /**
   * Statistiques des emails
   * GET /api/emails/stats
   * Protégé: Admin uniquement
   */
  app.get("/api/emails/stats", (req, res) => {
    // TODO: Ajouter la vérification du rôle admin
    // if (!req.user || req.user.role !== 'admin') {
    //   return res.status(403).json({ error: 'Accès refusé' });
    // }

    const stats = emailManager.getEmailStats();
    res.json(stats);
  });

  /**
   * Logs des emails
   * GET /api/emails/logs?limit=50
   * Protégé: Admin uniquement
   */
  app.get("/api/emails/logs", (req, res) => {
    // TODO: Ajouter la vérification du rôle admin
    
    const limit = parseInt(req.query.limit as string) || 50;
    const logs = emailManager.getEmailLogs(limit);
    
    res.json(logs);
  });

  /**
   * Lister les tâches cron programmées
   * GET /api/emails/cron/tasks
   * Protégé: Admin uniquement
   */
  app.get("/api/emails/cron/tasks", (req, res) => {
    // TODO: Ajouter la vérification du rôle admin
    
    // Pour l'instant on retourne un message indiquant que c'est dans les logs
    res.json({
      message: "Consultez les logs serveur pour voir les tâches programmées",
      note: "Exécutez emailCron.listTasks() dans la console"
    });
  });

  /**
   * Exécuter manuellement une tâche cron
   * POST /api/emails/cron/run/:taskId
   * Protégé: Admin uniquement
   */
  app.post("/api/emails/cron/run/:taskId", async (req, res) => {
    // TODO: Ajouter la vérification du rôle admin
    
    const { taskId } = req.params;
    
    try {
      await emailCron.runTask(taskId);
      res.json({
        success: true,
        message: `Tâche ${taskId} exécutée avec succès`
      });
    } catch (error) {
      res.status(500).json({
        error: "Erreur lors de l'exécution de la tâche"
      });
    }
  });

  console.log('✅ Email routes registered');
}







