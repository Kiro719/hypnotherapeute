// Système de tâches automatiques pour les emails (cron-like)
import { emailManager } from './email-manager';

interface ScheduledTask {
  id: string;
  name: string;
  schedule: string;
  lastRun?: Date;
  nextRun?: Date;
  isRunning: boolean;
}

class EmailCron {
  private tasks: Map<string, ScheduledTask> = new Map();
  private intervals: Map<string, NodeJS.Timeout> = new Map();

  constructor() {
    this.initializeTasks();
  }

  /**
   * Initialise les tâches programmées
   */
  private initializeTasks() {
    // Tâche : Envoyer les rappels 24h avant les RDV
    this.scheduleTask(
      'send-reminders-24h',
      'Envoi des rappels 24h avant les rendez-vous',
      '0 */6 * * *', // Toutes les 6 heures
      () => this.sendUpcomingAppointmentReminders()
    );

    // Tâche : Envoyer les emails de remerciement (après les séances)
    this.scheduleTask(
      'send-thanks-emails',
      'Envoi des emails de remerciement',
      '0 */3 * * *', // Toutes les 3 heures
      () => this.sendPostAppointmentThanks()
    );

    // Tâche : Envoyer les demandes d'avis (3 jours après)
    this.scheduleTask(
      'send-review-requests',
      'Envoi des demandes d\'avis',
      '0 10 * * *', // Tous les jours à 10h
      () => this.sendReviewRequests()
    );

    console.log('📅 Email cron tasks initialized');
    this.listTasks();
  }

  /**
   * Programme une tâche
   */
  private scheduleTask(
    id: string,
    name: string,
    schedule: string,
    handler: () => Promise<void>
  ) {
    const task: ScheduledTask = {
      id,
      name,
      schedule,
      isRunning: false,
    };

    this.tasks.set(id, task);

    // Pour simplifier, on utilise setInterval
    // En production, utiliser une vraie lib cron comme 'node-cron'
    const interval = this.parseScheduleToInterval(schedule);
    
    if (interval) {
      const timer = setInterval(async () => {
        if (task.isRunning) {
          console.log(`⏭️ Task ${id} déjà en cours, sauté`);
          return;
        }

        task.isRunning = true;
        task.lastRun = new Date();
        
        console.log(`▶️ Exécution de la tâche: ${name}`);
        
        try {
          await handler();
          console.log(`✅ Tâche terminée: ${name}`);
        } catch (error) {
          console.error(`❌ Erreur dans la tâche ${name}:`, error);
        } finally {
          task.isRunning = false;
          const nextRun = new Date(Date.now() + interval);
          task.nextRun = nextRun;
        }
      }, interval);

      this.intervals.set(id, timer);
      
      // Calculer nextRun
      task.nextRun = new Date(Date.now() + interval);
    }
  }

  /**
   * Convertit un pattern cron en intervalle (ms)
   * Simplifié pour la démo
   */
  private parseScheduleToInterval(schedule: string): number | null {
    // Format: minute hour day month dayofweek
    // Exemples:
    // '0 */6 * * *' = toutes les 6 heures
    // '0 10 * * *' = tous les jours à 10h
    
    if (schedule.includes('*/6')) {
      return 6 * 60 * 60 * 1000; // 6 heures
    } else if (schedule.includes('*/3')) {
      return 3 * 60 * 60 * 1000; // 3 heures
    } else if (schedule.includes('10 * * *')) {
      return 24 * 60 * 60 * 1000; // 24 heures (quotidien)
    }
    
    // Par défaut: 1 heure
    return 60 * 60 * 1000;
  }

  /**
   * Envoie les rappels pour les RDV dans 24h
   */
  private async sendUpcomingAppointmentReminders(): Promise<void> {
    console.log('📧 Vérification des rendez-vous nécessitant un rappel...');
    
    // TODO: Récupérer les RDV de la base de données
    // const appointments = await db.query.appointments.findMany({
    //   where: (appointments, { between, and }) => and(
    //     between(appointments.dateHeure, 
    //       new Date(Date.now() + 23 * 60 * 60 * 1000),
    //       new Date(Date.now() + 25 * 60 * 60 * 1000)
    //     ),
    //     eq(appointments.reminderSent, false)
    //   )
    // });

    // Pour la démo, on simule
    const upcomingAppointments: Array<{
      id: string;
      clientEmail: string;
      clientName: string;
      dateHeure: Date;
      serviceNom: string;
    }> = [];

    let sentCount = 0;
    for (const apt of upcomingAppointments) {
      const success = await emailManager.sendAppointmentReminder({
        clientEmail: apt.clientEmail,
        clientName: apt.clientName,
        appointmentDate: apt.dateHeure,
        appointmentTime: apt.dateHeure.toLocaleTimeString('fr-FR', {
          hour: '2-digit',
          minute: '2-digit'
        }),
        serviceName: apt.serviceNom,
      });

      if (success) {
        sentCount++;
        // TODO: Marquer comme envoyé dans la BDD
        // await db.update(appointments)
        //   .set({ reminderSent: true })
        //   .where(eq(appointments.id, apt.id));
      }
    }

    console.log(`✅ ${sentCount} rappels envoyés sur ${upcomingAppointments.length} rendez-vous`);
  }

  /**
   * Envoie les emails de remerciement après les séances
   */
  private async sendPostAppointmentThanks(): Promise<void> {
    console.log('🙏 Vérification des séances terminées...');
    
    // TODO: Récupérer les RDV terminés dans les dernières heures
    const completedAppointments: Array<{
      id: string;
      clientEmail: string;
      clientName: string;
      serviceNom: string;
    }> = [];

    let sentCount = 0;
    for (const apt of completedAppointments) {
      const success = await emailManager.sendAppointmentThanks({
        clientEmail: apt.clientEmail,
        clientName: apt.clientName,
        serviceName: apt.serviceNom,
      });

      if (success) sentCount++;
    }

    console.log(`✅ ${sentCount} emails de remerciement envoyés`);
  }

  /**
   * Envoie les demandes d'avis (3 jours après la séance)
   */
  private async sendReviewRequests(): Promise<void> {
    console.log('⭐ Vérification des rendez-vous pour demande d\'avis...');
    
    // TODO: Récupérer les RDV d'il y a 3 jours
    const appointmentsForReview: Array<{
      id: string;
      clientEmail: string;
      clientName: string;
      serviceNom: string;
      dateHeure: Date;
    }> = [];

    let sentCount = 0;
    for (const apt of appointmentsForReview) {
      const success = await emailManager.sendReviewRequest({
        clientEmail: apt.clientEmail,
        clientName: apt.clientName,
        serviceName: apt.serviceNom,
        appointmentDate: apt.dateHeure,
      });

      if (success) sentCount++;
    }

    console.log(`✅ ${sentCount} demandes d'avis envoyées`);
  }

  /**
   * Liste toutes les tâches programmées
   */
  listTasks(): void {
    console.log('\n📋 Tâches programmées:');
    this.tasks.forEach((task) => {
      console.log(`  - ${task.name}`);
      console.log(`    Schedule: ${task.schedule}`);
      if (task.nextRun) {
        console.log(`    Prochaine exécution: ${task.nextRun.toLocaleString('fr-FR')}`);
      }
      if (task.lastRun) {
        console.log(`    Dernière exécution: ${task.lastRun.toLocaleString('fr-FR')}`);
      }
    });
    console.log('');
  }

  /**
   * Arrête toutes les tâches
   */
  stopAll(): void {
    this.intervals.forEach((interval, id) => {
      clearInterval(interval);
      console.log(`⏹️ Tâche arrêtée: ${id}`);
    });
    this.intervals.clear();
  }

  /**
   * Arrête une tâche spécifique
   */
  stopTask(id: string): void {
    const interval = this.intervals.get(id);
    if (interval) {
      clearInterval(interval);
      this.intervals.delete(id);
      console.log(`⏹️ Tâche arrêtée: ${id}`);
    }
  }

  /**
   * Exécute manuellement une tâche
   */
  async runTask(id: string): Promise<void> {
    const task = this.tasks.get(id);
    if (!task) {
      console.error(`❌ Tâche introuvable: ${id}`);
      return;
    }

    console.log(`▶️ Exécution manuelle: ${task.name}`);
    
    switch(id) {
      case 'send-reminders-24h':
        await this.sendUpcomingAppointmentReminders();
        break;
      case 'send-thanks-emails':
        await this.sendPostAppointmentThanks();
        break;
      case 'send-review-requests':
        await this.sendReviewRequests();
        break;
      default:
        console.warn(`⚠️ Handler non défini pour: ${id}`);
    }
  }
}

// Instance singleton
export const emailCron = new EmailCron();

// Arrêt propre à la fermeture du serveur
process.on('SIGTERM', () => {
  console.log('📧 Arrêt des tâches email...');
  emailCron.stopAll();
});

process.on('SIGINT', () => {
  console.log('📧 Arrêt des tâches email...');
  emailCron.stopAll();
});







