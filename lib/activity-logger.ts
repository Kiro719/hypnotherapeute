// Système de logs d'activité pour audit de sécurité et conformité RGPD
import { Request } from "express";

export interface ActivityLog {
  id: string;
  timestamp: Date;
  userId: string | null;
  userEmail: string | null;
  userRole: string | null;
  action: ActivityAction;
  resource: string; // Ex: "appointment", "user", "blog-post"
  resourceId?: string;
  ipAddress: string;
  userAgent: string;
  details?: Record<string, any>;
  status: "success" | "failure" | "warning";
  securityLevel: "low" | "medium" | "high" | "critical";
}

export type ActivityAction =
  // Authentification
  | "login_success"
  | "login_failed"
  | "logout"
  | "password_reset_requested"
  | "password_changed"
  | "2fa_enabled"
  | "2fa_disabled"
  | "2fa_verified"
  
  // Gestion de compte
  | "account_created"
  | "account_deleted"
  | "account_modified"
  | "profile_updated"
  
  // RGPD
  | "data_exported"
  | "consent_updated"
  | "data_deletion_requested"
  
  // Rendez-vous
  | "appointment_created"
  | "appointment_cancelled"
  | "appointment_confirmed"
  | "appointment_modified"
  
  // Administration
  | "admin_access"
  | "config_modified"
  | "user_role_changed"
  | "blog_post_created"
  | "blog_post_modified"
  | "blog_post_deleted"
  
  // Sécurité
  | "suspicious_activity"
  | "multiple_failed_logins"
  | "unauthorized_access_attempt"
  | "api_rate_limit_exceeded";

class ActivityLogger {
  private logs: ActivityLog[] = [];
  private maxLogs = 10000; // Limite en mémoire avant archivage

  /**
   * Enregistre une activité
   */
  log(params: {
    userId?: string | null;
    userEmail?: string | null;
    userRole?: string | null;
    action: ActivityAction;
    resource: string;
    resourceId?: string;
    req?: Request;
    details?: Record<string, any>;
    status?: "success" | "failure" | "warning";
  }): void {
    const log: ActivityLog = {
      id: this.generateId(),
      timestamp: new Date(),
      userId: params.userId || null,
      userEmail: params.userEmail || null,
      userRole: params.userRole || null,
      action: params.action,
      resource: params.resource,
      resourceId: params.resourceId,
      ipAddress: this.getIpAddress(params.req),
      userAgent: params.req?.get("user-agent") || "unknown",
      details: params.details,
      status: params.status || "success",
      securityLevel: this.determineSecurityLevel(params.action),
    };

    this.logs.push(log);

    // Log dans la console pour le développement
    const emoji = this.getLogEmoji(log.securityLevel);
    console.log(
      `${emoji} [${log.securityLevel.toUpperCase()}] ${log.action} | User: ${log.userEmail || "anonymous"} | IP: ${log.ipAddress} | Status: ${log.status}`
    );

    // Si critique, log spécial
    if (log.securityLevel === "critical") {
      console.error(`🚨 SECURITY ALERT: ${log.action} by ${log.userEmail} from ${log.ipAddress}`);
    }

    // Nettoyer si trop de logs
    if (this.logs.length > this.maxLogs) {
      this.archiveOldLogs();
    }
  }

  /**
   * Récupère les logs d'un utilisateur
   */
  getUserLogs(userId: string, limit: number = 50): ActivityLog[] {
    return this.logs
      .filter((log) => log.userId === userId)
      .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
      .slice(0, limit);
  }

  /**
   * Récupère tous les logs (admin uniquement)
   */
  getAllLogs(filters?: {
    userId?: string;
    action?: ActivityAction;
    securityLevel?: ActivityLog["securityLevel"];
    startDate?: Date;
    endDate?: Date;
    limit?: number;
  }): ActivityLog[] {
    let filtered = [...this.logs];

    if (filters?.userId) {
      filtered = filtered.filter((log) => log.userId === filters.userId);
    }

    if (filters?.action) {
      filtered = filtered.filter((log) => log.action === filters.action);
    }

    if (filters?.securityLevel) {
      filtered = filtered.filter((log) => log.securityLevel === filters.securityLevel);
    }

    if (filters?.startDate) {
      filtered = filtered.filter((log) => log.timestamp >= filters.startDate!);
    }

    if (filters?.endDate) {
      filtered = filtered.filter((log) => log.timestamp <= filters.endDate!);
    }

    filtered.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());

    return filtered.slice(0, filters?.limit || 100);
  }

  /**
   * Détecte les activités suspectes
   */
  detectSuspiciousActivity(userId: string): {
    isSuspicious: boolean;
    reasons: string[];
  } {
    const userLogs = this.getUserLogs(userId, 100);
    const reasons: string[] = [];

    // Vérifier les tentatives de connexion échouées
    const failedLogins = userLogs.filter(
      (log) => log.action === "login_failed" && this.isRecent(log.timestamp, 30)
    );
    if (failedLogins.length >= 5) {
      reasons.push(`${failedLogins.length} tentatives de connexion échouées dans les 30 dernières minutes`);
    }

    // Vérifier les connexions depuis différentes IPs
    const recentIPs = new Set(
      userLogs
        .filter((log) => this.isRecent(log.timestamp, 60))
        .map((log) => log.ipAddress)
    );
    if (recentIPs.size >= 3) {
      reasons.push(`Connexions depuis ${recentIPs.size} adresses IP différentes en 1 heure`);
    }

    // Vérifier les actions critiques récentes
    const criticalActions = userLogs.filter(
      (log) => log.securityLevel === "critical" && this.isRecent(log.timestamp, 60)
    );
    if (criticalActions.length >= 2) {
      reasons.push(`${criticalActions.length} actions critiques en 1 heure`);
    }

    return {
      isSuspicious: reasons.length > 0,
      reasons,
    };
  }

  /**
   * Export des logs pour un utilisateur (RGPD)
   */
  exportUserLogs(userId: string): ActivityLog[] {
    return this.getUserLogs(userId, 10000); // Tous les logs de l'utilisateur
  }

  /**
   * Suppression des logs d'un utilisateur (droit à l'oubli)
   */
  deleteUserLogs(userId: string): number {
    const initialLength = this.logs.length;
    this.logs = this.logs.filter((log) => log.userId !== userId);
    const deleted = initialLength - this.logs.length;

    console.log(`[RGPD] Deleted ${deleted} activity logs for user ${userId}`);
    return deleted;
  }

  // Helpers privés
  private generateId(): string {
    return `log_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private getIpAddress(req?: Request): string {
    if (!req) return "unknown";
    return (
      (req.headers["x-forwarded-for"] as string)?.split(",")[0]?.trim() ||
      req.socket?.remoteAddress ||
      "unknown"
    );
  }

  private determineSecurityLevel(action: ActivityAction): ActivityLog["securityLevel"] {
    const criticalActions: ActivityAction[] = [
      "account_deleted",
      "data_deletion_requested",
      "user_role_changed",
      "unauthorized_access_attempt",
      "multiple_failed_logins",
    ];

    const highActions: ActivityAction[] = [
      "password_changed",
      "2fa_disabled",
      "config_modified",
      "admin_access",
    ];

    const mediumActions: ActivityAction[] = [
      "login_success",
      "data_exported",
      "consent_updated",
      "account_modified",
    ];

    if (criticalActions.includes(action)) return "critical";
    if (highActions.includes(action)) return "high";
    if (mediumActions.includes(action)) return "medium";
    return "low";
  }

  private getLogEmoji(level: ActivityLog["securityLevel"]): string {
    const emojis = {
      low: "ℹ️",
      medium: "⚠️",
      high: "🔶",
      critical: "🚨",
    };
    return emojis[level];
  }

  private isRecent(timestamp: Date, minutes: number): boolean {
    const now = new Date();
    const diffMinutes = (now.getTime() - timestamp.getTime()) / 1000 / 60;
    return diffMinutes <= minutes;
  }

  private archiveOldLogs(): void {
    // Garder seulement les 5000 logs les plus récents
    this.logs.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
    const archived = this.logs.splice(5000);
    
    console.log(`[ARCHIVE] Archived ${archived.length} old activity logs`);
    
    // TODO: Sauvegarder dans un fichier ou une base de données
    // Pour l'instant, on les perd (en production, il faudrait les sauvegarder)
  }
}

// Instance singleton
export const activityLogger = new ActivityLogger();

// Middleware Express pour logger automatiquement certaines actions
export function logActivity(action: ActivityAction, resource: string) {
  return (req: Request, _res: any, next: any) => {
    activityLogger.log({
      action,
      resource,
      req,
      userId: (req as any).user?.id,
      userEmail: (req as any).user?.email,
      userRole: (req as any).user?.role,
    });
    next();
  };
}







