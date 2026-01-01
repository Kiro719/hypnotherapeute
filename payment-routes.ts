import { Express, Request, Response } from 'express';
import { createPaymentIntent, confirmPayment, cancelPaymentIntent } from './stripe.js';

export function registerPaymentRoutes(app: Express) {
  // Créer une intention de paiement
  app.post('/api/payment/create-intent', async (req: Request, res: Response) => {
    try {
      const { amount, currency = 'eur', appointmentId, serviceName } = req.body;

      if (!amount || amount <= 0) {
        return res.status(400).json({ error: 'Montant invalide' });
      }

      const metadata = {
        appointmentId: appointmentId || '',
        serviceName: serviceName || '',
      };

      const { clientSecret, paymentIntentId } = await createPaymentIntent(
        amount,
        currency,
        metadata
      );

      res.json({
        clientSecret,
        paymentIntentId,
      });
    } catch (error) {
      console.error('Erreur lors de la création du Payment Intent:', error);
      res.status(500).json({ error: 'Erreur serveur lors de la création du paiement' });
    }
  });

  // Confirmer un paiement
  app.post('/api/payment/confirm', async (req: Request, res: Response) => {
    try {
      const { paymentIntentId } = req.body;

      if (!paymentIntentId) {
        return res.status(400).json({ error: 'ID de paiement manquant' });
      }

      const isConfirmed = await confirmPayment(paymentIntentId);

      if (isConfirmed) {
        res.json({ success: true, message: 'Paiement confirmé' });
      } else {
        res.status(400).json({ error: 'Paiement non confirmé' });
      }
    } catch (error) {
      console.error('Erreur lors de la confirmation du paiement:', error);
      res.status(500).json({ error: 'Erreur serveur lors de la confirmation' });
    }
  });

  // Annuler un paiement
  app.post('/api/payment/cancel', async (req: Request, res: Response) => {
    try {
      const { paymentIntentId } = req.body;

      if (!paymentIntentId) {
        return res.status(400).json({ error: 'ID de paiement manquant' });
      }

      const isCancelled = await cancelPaymentIntent(paymentIntentId);

      if (isCancelled) {
        res.json({ success: true, message: 'Paiement annulé' });
      } else {
        res.status(400).json({ error: 'Impossible d\'annuler le paiement' });
      }
    } catch (error) {
      console.error('Erreur lors de l\'annulation du paiement:', error);
      res.status(500).json({ error: 'Erreur serveur lors de l\'annulation' });
    }
  });
}
