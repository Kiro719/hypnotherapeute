// Templates d'emails HTML professionnels
import type { Appointment } from "@db/schema";

/**
 * Template de base pour tous les emails
 */
function baseTemplate(content: string, preheader?: string): string {
  return `
<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta name="x-apple-disable-message-reformatting">
  ${preheader ? `<meta name="description" content="${preheader}">` : ''}
  <style>
    body {
      margin: 0;
      padding: 0;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
      background-color: #f5f5f5;
      color: #333333;
    }
    .container {
      max-width: 600px;
      margin: 0 auto;
      background-color: #ffffff;
    }
    .header {
      background: linear-gradient(135deg, #2d8a8a 0%, #236969 100%);
      padding: 40px 20px;
      text-align: center;
      color: #ffffff;
    }
    .logo {
      font-size: 28px;
      font-weight: bold;
      margin: 0;
      font-family: Georgia, serif;
    }
    .content {
      padding: 40px 30px;
    }
    .button {
      display: inline-block;
      padding: 14px 32px;
      background-color: #2d8a8a;
      color: #ffffff !important;
      text-decoration: none;
      border-radius: 6px;
      font-weight: 600;
      margin: 20px 0;
    }
    .button:hover {
      background-color: #236969;
    }
    .info-box {
      background-color: #f0f9f9;
      border-left: 4px solid #2d8a8a;
      padding: 20px;
      margin: 20px 0;
      border-radius: 4px;
    }
    .info-row {
      margin: 12px 0;
      display: flex;
      justify-content: space-between;
    }
    .info-label {
      color: #666666;
      font-weight: 500;
    }
    .info-value {
      color: #333333;
      font-weight: 600;
    }
    .footer {
      background-color: #f5f5f5;
      padding: 30px 20px;
      text-align: center;
      color: #666666;
      font-size: 14px;
    }
    .footer a {
      color: #2d8a8a;
      text-decoration: none;
    }
    h1 {
      color: #333333;
      font-size: 24px;
      margin: 0 0 20px 0;
    }
    p {
      line-height: 1.6;
      margin: 0 0 15px 0;
    }
    .highlight {
      color: #2d8a8a;
      font-weight: 600;
    }
    @media only screen and (max-width: 600px) {
      .content {
        padding: 30px 20px;
      }
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1 class="logo">🌀 Cabinet d'Hypnothérapie</h1>
    </div>
    <div class="content">
      ${content}
    </div>
    <div class="footer">
      <p>
        <strong>Cabinet d'Hypnothérapie</strong><br>
        📍 [Adresse du cabinet]<br>
        📞 [Téléphone] | ✉️ <a href="mailto:contact@hypnotherapie.fr">contact@hypnotherapie.fr</a>
      </p>
      <p style="margin-top: 20px; font-size: 12px;">
        <a href="{{unsubscribe_link}}">Se désabonner</a> | 
        <a href="[URL du site]/confidentialite">Politique de confidentialité</a>
      </p>
    </div>
  </div>
</body>
</html>
  `.trim();
}

/**
 * Email de confirmation de rendez-vous
 */
export function appointmentConfirmationEmail(data: {
  clientName: string;
  appointmentDate: Date;
  appointmentTime: string;
  serviceName: string;
  duration: number;
  price?: number;
  location: string;
  therapistName: string;
  confirmationNumber?: string;
}): string {
  const dateFormatted = data.appointmentDate.toLocaleDateString('fr-FR', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  const content = `
    <h1>✅ Votre rendez-vous est confirmé</h1>
    <p>Bonjour <strong>${data.clientName}</strong>,</p>
    <p>
      Nous avons bien reçu votre demande de rendez-vous. Nous sommes heureux de vous accueillir 
      au cabinet pour votre séance d'hypnothérapie.
    </p>

    <div class="info-box">
      <div class="info-row">
        <span class="info-label">📅 Date</span>
        <span class="info-value">${dateFormatted}</span>
      </div>
      <div class="info-row">
        <span class="info-label">🕐 Heure</span>
        <span class="info-value">${data.appointmentTime}</span>
      </div>
      <div class="info-row">
        <span class="info-label">⏱️ Durée</span>
        <span class="info-value">${data.duration} minutes</span>
      </div>
      <div class="info-row">
        <span class="info-label">💆 Service</span>
        <span class="info-value">${data.serviceName}</span>
      </div>
      ${data.price ? `
      <div class="info-row">
        <span class="info-label">💰 Tarif</span>
        <span class="info-value">${data.price}€</span>
      </div>
      ` : ''}
      <div class="info-row">
        <span class="info-label">👨‍⚕️ Thérapeute</span>
        <span class="info-value">${data.therapistName}</span>
      </div>
      <div class="info-row">
        <span class="info-label">📍 Lieu</span>
        <span class="info-value">${data.location}</span>
      </div>
      ${data.confirmationNumber ? `
      <div class="info-row">
        <span class="info-label">🔖 Numéro de confirmation</span>
        <span class="info-value">${data.confirmationNumber}</span>
      </div>
      ` : ''}
    </div>

    <p>
      <strong>⚠️ Important :</strong> Merci d'arriver <span class="highlight">5 minutes avant</span> 
      l'heure de votre rendez-vous.
    </p>

    <center>
      <a href="[URL_SITE]/portail" class="button">Voir mon portail client</a>
    </center>

    <p style="margin-top: 30px;">
      <strong>Vous avez besoin d'annuler ou de modifier ce rendez-vous ?</strong><br>
      Connectez-vous à votre portail client ou contactez-nous au [TÉLÉPHONE].
    </p>

    <p style="margin-top: 20px; color: #666; font-size: 14px;">
      💡 <em>Vous recevrez un rappel 24 heures avant votre rendez-vous.</em>
    </p>
  `;

  return baseTemplate(content, 'Votre rendez-vous est confirmé');
}

/**
 * Email de rappel 24h avant le rendez-vous
 */
export function appointmentReminderEmail(data: {
  clientName: string;
  appointmentDate: Date;
  appointmentTime: string;
  serviceName: string;
  location: string;
  therapistName: string;
}): string {
  const dateFormatted = data.appointmentDate.toLocaleDateString('fr-FR', {
    weekday: 'long',
    day: 'numeric',
    month: 'long'
  });

  const content = `
    <h1>⏰ Rappel : Votre rendez-vous est demain</h1>
    <p>Bonjour <strong>${data.clientName}</strong>,</p>
    <p>
      Nous vous rappelons que vous avez un rendez-vous prévu <span class="highlight">demain</span> 
      avec ${data.therapistName}.
    </p>

    <div class="info-box">
      <div class="info-row">
        <span class="info-label">📅 Date</span>
        <span class="info-value">${dateFormatted}</span>
      </div>
      <div class="info-row">
        <span class="info-label">🕐 Heure</span>
        <span class="info-value">${data.appointmentTime}</span>
      </div>
      <div class="info-row">
        <span class="info-label">💆 Service</span>
        <span class="info-value">${data.serviceName}</span>
      </div>
      <div class="info-row">
        <span class="info-label">📍 Lieu</span>
        <span class="info-value">${data.location}</span>
      </div>
    </div>

    <p>
      <strong>📝 Préparation :</strong>
    </p>
    <ul style="line-height: 1.8;">
      <li>Arrivez <strong>5 minutes avant</strong> votre rendez-vous</li>
      <li>Portez des vêtements <strong>confortables</strong></li>
      <li>Évitez la caféine dans les heures précédant la séance</li>
      <li>Préparez vos <strong>questions</strong> si vous en avez</li>
    </ul>

    <center>
      <a href="[URL_SITE]/portail" class="button">Accéder à mon portail</a>
    </center>

    <p style="margin-top: 30px; padding: 15px; background-color: #fff3cd; border-radius: 4px;">
      ⚠️ <strong>Besoin d'annuler ?</strong><br>
      Si vous ne pouvez pas honorer ce rendez-vous, merci de nous prévenir au plus tôt 
      au [TÉLÉPHONE] ou via votre portail client.
    </p>

    <p style="margin-top: 20px; text-align: center;">
      À demain ! 😊
    </p>
  `;

  return baseTemplate(content, 'Rappel : rendez-vous demain');
}

/**
 * Email de remerciement après la séance
 */
export function appointmentThanksEmail(data: {
  clientName: string;
  serviceName: string;
  therapistName: string;
  nextAppointmentSuggestion?: string;
}): string {
  const content = `
    <h1>🙏 Merci pour votre visite</h1>
    <p>Bonjour <strong>${data.clientName}</strong>,</p>
    <p>
      Merci d'avoir choisi notre cabinet pour votre séance de <strong>${data.serviceName}</strong>. 
      Nous espérons que cette expérience a répondu à vos attentes.
    </p>

    <p>
      ${data.therapistName} reste à votre disposition pour toute question concernant 
      votre parcours thérapeutique.
    </p>

    <div class="info-box">
      <h3 style="margin-top: 0; color: #2d8a8a;">📋 Recommandations post-séance</h3>
      <ul style="line-height: 1.8; margin: 10px 0;">
        <li>Prenez le temps de vous <strong>reposer</strong> si nécessaire</li>
        <li>Restez <strong>hydraté(e)</strong> dans les heures suivantes</li>
        <li>Notez vos <strong>observations</strong> et ressentis</li>
        <li>Pratiquez les exercices recommandés</li>
      </ul>
    </div>

    ${data.nextAppointmentSuggestion ? `
    <p>
      <strong>💡 Prochaine étape :</strong><br>
      ${data.nextAppointmentSuggestion}
    </p>
    <center>
      <a href="[URL_SITE]/reserver" class="button">Prendre un nouveau rendez-vous</a>
    </center>
    ` : ''}

    <p style="margin-top: 30px; padding: 20px; background-color: #f0f9f9; border-radius: 6px;">
      <strong>💬 Votre avis compte !</strong><br>
      Aidez-nous à améliorer nos services en partageant votre expérience.<br>
      <a href="[URL_SITE]/avis" style="color: #2d8a8a; font-weight: 600;">Laisser un avis →</a>
    </p>

    <p style="margin-top: 20px; text-align: center;">
      Au plaisir de vous revoir ! ✨
    </p>
  `;

  return baseTemplate(content, 'Merci pour votre visite');
}

/**
 * Email de demande d'avis
 */
export function reviewRequestEmail(data: {
  clientName: string;
  serviceName: string;
  appointmentDate: Date;
}): string {
  const dateFormatted = data.appointmentDate.toLocaleDateString('fr-FR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });

  const content = `
    <h1>⭐ Partagez votre expérience</h1>
    <p>Bonjour <strong>${data.clientName}</strong>,</p>
    <p>
      Quelques jours se sont écoulés depuis votre séance de <strong>${data.serviceName}</strong> 
      le ${dateFormatted}. Nous espérons que vous avez ressenti des bénéfices positifs.
    </p>

    <p>
      Votre retour d'expérience est <span class="highlight">très important</span> pour nous aider 
      à améliorer nos services et aider d'autres personnes à franchir le pas.
    </p>

    <center>
      <p style="font-size: 18px; margin: 30px 0 20px 0;">
        <strong>Comment évalueriez-vous votre expérience ?</strong>
      </p>
      <div style="font-size: 40px; margin: 20px 0;">
        ⭐ ⭐ ⭐ ⭐ ⭐
      </div>
      <a href="[URL_SITE]/avis?rating=5" class="button">Laisser mon avis</a>
    </center>

    <p style="margin-top: 40px; padding: 20px; background-color: #f0f9f9; border-radius: 6px;">
      <strong>🎁 Bonus</strong><br>
      En déposant un avis, vous participez à notre programme de fidélité et bénéficiez 
      d'une <strong>réduction de 10€</strong> sur votre prochaine séance !
    </p>

    <p style="margin-top: 20px; font-size: 14px; color: #666;">
      💡 <em>Votre avis peut être anonyme si vous le souhaitez.</em>
    </p>

    <p style="margin-top: 30px; text-align: center;">
      Merci pour votre confiance ! 🙏
    </p>
  `;

  return baseTemplate(content, 'Partagez votre expérience');
}

/**
 * Email de bienvenue (inscription)
 */
export function welcomeEmail(data: {
  userName: string;
  userEmail: string;
}): string {
  const content = `
    <h1>🎉 Bienvenue chez nous !</h1>
    <p>Bonjour <strong>${data.userName}</strong>,</p>
    <p>
      Merci d'avoir créé votre compte sur notre plateforme. Nous sommes ravis de vous accueillir 
      dans notre communauté dédiée au bien-être et à l'hypnothérapie.
    </p>

    <div class="info-box">
      <h3 style="margin-top: 0; color: #2d8a8a;">✨ Que pouvez-vous faire maintenant ?</h3>
      <ul style="line-height: 1.8; margin: 10px 0;">
        <li><strong>Réserver</strong> votre première séance d'hypnothérapie</li>
        <li><strong>Découvrir</strong> nos différents services</li>
        <li><strong>Consulter</strong> nos articles de blog</li>
        <li><strong>Gérer</strong> vos rendez-vous depuis votre portail</li>
      </ul>
    </div>

    <center>
      <a href="[URL_SITE]/reserver" class="button">Réserver ma première séance</a>
    </center>

    <p style="margin-top: 30px; padding: 20px; background-color: #fff3cd; border-radius: 6px;">
      🎁 <strong>Offre de bienvenue</strong><br>
      Profitez de <strong>15% de réduction</strong> sur votre première séance avec le code : 
      <strong style="font-size: 18px; color: #2d8a8a;">BIENVENUE15</strong>
    </p>

    <p style="margin-top: 20px;">
      <strong>📧 Vos identifiants :</strong><br>
      Email : <span class="highlight">${data.userEmail}</span>
    </p>

    <p style="margin-top: 30px; text-align: center;">
      Au plaisir de vous accompagner dans votre démarche ! 🌟
    </p>
  `;

  return baseTemplate(content, 'Bienvenue sur votre plateforme de bien-être');
}

/**
 * Email d'annulation de rendez-vous
 */
export function appointmentCancelledEmail(data: {
  clientName: string;
  appointmentDate: Date;
  appointmentTime: string;
  serviceName: string;
  cancelledBy: 'client' | 'therapist';
  reason?: string;
}): string {
  const dateFormatted = data.appointmentDate.toLocaleDateString('fr-FR', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });

  const content = `
    <h1>❌ Rendez-vous annulé</h1>
    <p>Bonjour <strong>${data.clientName}</strong>,</p>
    <p>
      ${data.cancelledBy === 'client' 
        ? 'Nous avons bien pris en compte l\'annulation de votre rendez-vous.' 
        : 'Nous sommes au regret de devoir annuler votre rendez-vous.'}
    </p>

    <div class="info-box">
      <div class="info-row">
        <span class="info-label">📅 Date</span>
        <span class="info-value">${dateFormatted}</span>
      </div>
      <div class="info-row">
        <span class="info-label">🕐 Heure</span>
        <span class="info-value">${data.appointmentTime}</span>
      </div>
      <div class="info-row">
        <span class="info-label">💆 Service</span>
        <span class="info-value">${data.serviceName}</span>
      </div>
      ${data.reason ? `
      <div class="info-row">
        <span class="info-label">📝 Raison</span>
        <span class="info-value">${data.reason}</span>
      </div>
      ` : ''}
    </div>

    ${data.cancelledBy === 'client' ? `
    <p style="margin-top: 30px;">
      Nous espérons avoir l'occasion de vous accueillir prochainement. 
      N'hésitez pas à reprendre rendez-vous dès que possible.
    </p>
    ` : `
    <p style="margin-top: 30px; padding: 15px; background-color: #fff3cd; border-radius: 4px;">
      ⚠️ Nous vous présentons nos excuses pour ce désagrément. 
      Nous vous invitons à reprendre rendez-vous aux horaires qui vous conviennent.
    </p>
    `}

    <center>
      <a href="[URL_SITE]/reserver" class="button">Reprendre un rendez-vous</a>
    </center>

    <p style="margin-top: 20px; text-align: center;">
      Besoin d'aide ? Contactez-nous au [TÉLÉPHONE]
    </p>
  `;

  return baseTemplate(content, 'Votre rendez-vous a été annulé');
}







