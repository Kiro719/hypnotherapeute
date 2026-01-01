// Service d'envoi d'emails avec Nodemailer
import nodemailer from 'nodemailer';
import type { Transporter } from 'nodemailer';

export interface EmailOptions {
  to: string;
  subject: string;
  html: string;
  text?: string;
  attachments?: Array<{
    filename: string;
    content?: string | Buffer;
    path?: string;
  }>;
}

export interface EmailLog {
  id: string;
  to: string;
  subject: string;
  type: EmailType;
  status: 'sent' | 'failed' | 'pending';
  sentAt?: Date;
  error?: string;
}

export type EmailType = 
  | 'appointment_confirmation'
  | 'appointment_reminder'
  | 'appointment_cancelled'
  | 'appointment_thanks'
  | 'review_request'
  | 'welcome'
  | 'password_reset'
  | 'newsletter';

class EmailService {
  private transporter: Transporter | null = null;
  private emailLogs: EmailLog[] = [];
  private isConfigured: boolean = false;

  constructor() {
    this.configure();
  }

  /**
   * Configure le transporteur Nodemailer
   */
  private configure() {
    try {
      // Configuration pour Gmail (à adapter selon votre fournisseur)
      this.transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST || 'smtp.gmail.com',
        port: parseInt(process.env.SMTP_PORT || '587'),
        secure: process.env.SMTP_SECURE === 'true', // true pour 465, false pour autres ports
        auth: {
          user: process.env.SMTP_USER, // Votre email
          pass: process.env.SMTP_PASS, // Mot de passe d'application Gmail
        },
      });

      this.isConfigured = true;
      console.log('✅ Email service configured successfully');
    } catch (error) {
      console.error('❌ Failed to configure email service:', error);
      this.isConfigured = false;
    }
  }

  /**
   * Vérifie la connexion au serveur SMTP
   */
  async verifyConnection(): Promise<boolean> {
    if (!this.transporter) return false;

    try {
      await this.transporter.verify();
      console.log('✅ SMTP connection verified');
      return true;
    } catch (error) {
      console.error('❌ SMTP connection failed:', error);
      return false;
    }
  }

  /**
   * Envoie un email
   */
  async sendEmail(options: EmailOptions, type: EmailType = 'newsletter'): Promise<boolean> {
    if (!this.isConfigured || !this.transporter) {
      console.warn('⚠️ Email service not configured - email not sent');
      this.logEmail(options.to, options.subject, type, 'failed', 'Service not configured');
      return false;
    }

    const logId = this.generateLogId();

    try {
      const info = await this.transporter.sendMail({
        from: `"${process.env.SMTP_FROM_NAME || 'Cabinet d\'Hypnothérapie'}" <${process.env.SMTP_FROM || process.env.SMTP_USER}>`,
        to: options.to,
        subject: options.subject,
        html: options.html,
        text: options.text || this.htmlToText(options.html),
        attachments: options.attachments,
      });

      console.log(`✅ Email sent to ${options.to} - Message ID: ${info.messageId}`);
      this.logEmail(options.to, options.subject, type, 'sent');
      return true;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      console.error(`❌ Failed to send email to ${options.to}:`, errorMessage);
      this.logEmail(options.to, options.subject, type, 'failed', errorMessage);
      return false;
    }
  }

  /**
   * Convertit HTML en texte brut simple
   */
  private htmlToText(html: string): string {
    return html
      .replace(/<br\s*\/?>/gi, '\n')
      .replace(/<\/p>/gi, '\n\n')
      .replace(/<[^>]+>/g, '')
      .replace(/&nbsp;/g, ' ')
      .trim();
  }

  /**
   * Log un email envoyé
   */
  private logEmail(to: string, subject: string, type: EmailType, status: 'sent' | 'failed', error?: string) {
    const log: EmailLog = {
      id: this.generateLogId(),
      to,
      subject,
      type,
      status,
      sentAt: status === 'sent' ? new Date() : undefined,
      error,
    };

    this.emailLogs.push(log);

    // Garder seulement les 1000 derniers logs
    if (this.emailLogs.length > 1000) {
      this.emailLogs = this.emailLogs.slice(-1000);
    }
  }

  /**
   * Récupère les logs d'emails
   */
  getEmailLogs(limit: number = 50): EmailLog[] {
    return this.emailLogs
      .sort((a, b) => {
        const dateA = a.sentAt || new Date(0);
        const dateB = b.sentAt || new Date(0);
        return dateB.getTime() - dateA.getTime();
      })
      .slice(0, limit);
  }

  /**
   * Statistiques d'envoi
   */
  getStats(): {
    total: number;
    sent: number;
    failed: number;
    successRate: number;
    byType: Record<EmailType, number>;
  } {
    const total = this.emailLogs.length;
    const sent = this.emailLogs.filter(log => log.status === 'sent').length;
    const failed = this.emailLogs.filter(log => log.status === 'failed').length;
    const successRate = total > 0 ? (sent / total) * 100 : 0;

    const byType: Record<string, number> = {};
    this.emailLogs.forEach(log => {
      byType[log.type] = (byType[log.type] || 0) + 1;
    });

    return {
      total,
      sent,
      failed,
      successRate: Math.round(successRate * 10) / 10,
      byType: byType as Record<EmailType, number>,
    };
  }

  private generateLogId(): string {
    return `email_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }
}

// Instance singleton
export const emailService = new EmailService();

// Vérifier la connexion au démarrage
emailService.verifyConnection().catch(err => {
  console.error('Failed to verify email connection:', err);
});







