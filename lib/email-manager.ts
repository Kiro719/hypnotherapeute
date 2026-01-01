// Gestionnaire d'envoi d'emails automatiques
import { emailService, type EmailType } from './email-service';
import * as templates from './email-templates';
import type { Appointment } from '@db/schema';

class EmailManager {
  /**
   * Envoie un email de confirmation de rendez-vous
   */
  async sendAppointmentConfirmation(data: {
    clientEmail: string;
    clientName: string;
    appointmentDate: Date;
    appointmentTime: string;
    serviceName: string;
    duration: number;
    price?: number;
    therapistName?: string;
    confirmationNumber?: string;
  }): Promise<boolean> {
    const html = templates.appointmentConfirmationEmail({
      ...data,
      location: "[Adresse du cabinet]", // À configurer
      therapistName: data.therapistName || "Dr. Nom du Thérapeute",
    });

    return await emailService.sendEmail(
      {
        to: data.clientEmail,
        subject: `✅ Confirmation de votre rendez-vous - ${data.appointmentDate.toLocaleDateString('fr-FR')}`,
        html,
      },
      'appointment_confirmation'
    );
  }

  /**
   * Envoie un rappel 24h avant le rendez-vous
   */
  async sendAppointmentReminder(data: {
    clientEmail: string;
    clientName: string;
    appointmentDate: Date;
    appointmentTime: string;
    serviceName: string;
    therapistName?: string;
  }): Promise<boolean> {
    const html = templates.appointmentReminderEmail({
      ...data,
      location: "[Adresse du cabinet]",
      therapistName: data.therapistName || "Dr. Nom du Thérapeute",
    });

    return await emailService.sendEmail(
      {
        to: data.clientEmail,
        subject: `⏰ Rappel : Votre rendez-vous est demain`,
        html,
      },
      'appointment_reminder'
    );
  }

  /**
   * Envoie un email de remerciement après la séance
   */
  async sendAppointmentThanks(data: {
    clientEmail: string;
    clientName: string;
    serviceName: string;
    therapistName?: string;
    nextAppointmentSuggestion?: string;
  }): Promise<boolean> {
    const html = templates.appointmentThanksEmail({
      ...data,
      therapistName: data.therapistName || "Dr. Nom du Thérapeute",
    });

    return await emailService.sendEmail(
      {
        to: data.clientEmail,
        subject: `🙏 Merci pour votre visite au cabinet`,
        html,
      },
      'appointment_thanks'
    );
  }

  /**
   * Envoie une demande d'avis quelques jours après la séance
   */
  async sendReviewRequest(data: {
    clientEmail: string;
    clientName: string;
    serviceName: string;
    appointmentDate: Date;
  }): Promise<boolean> {
    const html = templates.reviewRequestEmail(data);

    return await emailService.sendEmail(
      {
        to: data.clientEmail,
        subject: `⭐ Comment s'est passée votre séance ?`,
        html,
      },
      'review_request'
    );
  }

  /**
   * Envoie un email de bienvenue après inscription
   */
  async sendWelcomeEmail(data: {
    userEmail: string;
    userName: string;
  }): Promise<boolean> {
    const html = templates.welcomeEmail(data);

    return await emailService.sendEmail(
      {
        to: data.userEmail,
        subject: `🎉 Bienvenue sur notre plateforme !`,
        html,
      },
      'welcome'
    );
  }

  /**
   * Envoie un email d'annulation de rendez-vous
   */
  async sendAppointmentCancellation(data: {
    clientEmail: string;
    clientName: string;
    appointmentDate: Date;
    appointmentTime: string;
    serviceName: string;
    cancelledBy: 'client' | 'therapist';
    reason?: string;
  }): Promise<boolean> {
    const html = templates.appointmentCancelledEmail(data);

    return await emailService.sendEmail(
      {
        to: data.clientEmail,
        subject: `❌ Annulation de votre rendez-vous`,
        html,
      },
      'appointment_cancelled'
    );
  }

  /**
   * Programme les emails automatiques pour un rendez-vous
   */
  scheduleAppointmentEmails(appointment: {
    id: string;
    clientEmail: string;
    clientName: string;
    dateHeure: Date;
    serviceNom: string;
    duree?: number;
    prix?: number;
  }): void {
    // 1. Email de confirmation immédiat (déjà envoyé normalement)
    
    // 2. Programmer le rappel 24h avant
    const reminderTime = new Date(appointment.dateHeure);
    reminderTime.setHours(reminderTime.getHours() - 24);
    
    const now = new Date();
    const timeUntilReminder = reminderTime.getTime() - now.getTime();
    
    if (timeUntilReminder > 0) {
      setTimeout(() => {
        this.sendAppointmentReminder({
          clientEmail: appointment.clientEmail,
          clientName: appointment.clientName,
          appointmentDate: appointment.dateHeure,
          appointmentTime: appointment.dateHeure.toLocaleTimeString('fr-FR', {
            hour: '2-digit',
            minute: '2-digit'
          }),
          serviceName: appointment.serviceNom,
        });
      }, timeUntilReminder);
      
      console.log(`📅 Rappel programmé pour ${reminderTime.toLocaleString('fr-FR')}`);
    }
    
    // 3. Programmer l'email de remerciement 2h après le RDV
    const thanksTime = new Date(appointment.dateHeure);
    thanksTime.setHours(thanksTime.getHours() + (appointment.duree ? Math.ceil(appointment.duree / 60) + 2 : 3));
    
    const timeUntilThanks = thanksTime.getTime() - now.getTime();
    
    if (timeUntilThanks > 0) {
      setTimeout(() => {
        this.sendAppointmentThanks({
          clientEmail: appointment.clientEmail,
          clientName: appointment.clientName,
          serviceName: appointment.serviceNom,
        });
      }, timeUntilThanks);
      
      console.log(`🙏 Email de remerciement programmé pour ${thanksTime.toLocaleString('fr-FR')}`);
    }
    
    // 4. Programmer la demande d'avis 3 jours après
    const reviewRequestTime = new Date(appointment.dateHeure);
    reviewRequestTime.setDate(reviewRequestTime.getDate() + 3);
    reviewRequestTime.setHours(10, 0, 0, 0); // À 10h du matin
    
    const timeUntilReview = reviewRequestTime.getTime() - now.getTime();
    
    if (timeUntilReview > 0) {
      setTimeout(() => {
        this.sendReviewRequest({
          clientEmail: appointment.clientEmail,
          clientName: appointment.clientName,
          serviceName: appointment.serviceNom,
          appointmentDate: appointment.dateHeure,
        });
      }, timeUntilReview);
      
      console.log(`⭐ Demande d'avis programmée pour ${reviewRequestTime.toLocaleString('fr-FR')}`);
    }
  }

  /**
   * Récupère les statistiques d'envoi
   */
  getEmailStats() {
    return emailService.getStats();
  }

  /**
   * Récupère les logs d'emails
   */
  getEmailLogs(limit?: number) {
    return emailService.getEmailLogs(limit);
  }
}

// Instance singleton
export const emailManager = new EmailManager();







