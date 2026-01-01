import Stripe from 'stripe';

// Configuration Stripe
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || 'sk_test_51234567890abcdef', {
  apiVersion: '2024-12-18.acacia',
});

export default stripe;

// Fonction pour créer un Payment Intent
export async function createPaymentIntent(amount: number, currency: string = 'eur', metadata?: Record<string, string>) {
  try {
    // Mode test si pas de clé Stripe configurée
    if (!process.env.STRIPE_SECRET_KEY || process.env.STRIPE_SECRET_KEY === 'sk_test_51234567890abcdef') {
      console.log('[STRIPE TEST] Mode test activé - création d\'un Payment Intent simulé');
      return {
        clientSecret: 'pi_test_' + Math.random().toString(36).substring(2, 15),
        paymentIntentId: 'pi_test_' + Math.random().toString(36).substring(2, 15),
      };
    }

    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100), // Stripe utilise les centimes
      currency,
      metadata: metadata || {},
      automatic_payment_methods: {
        enabled: true,
      },
    });

    return {
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id,
    };
  } catch (error) {
    console.error('Erreur lors de la création du Payment Intent:', error);
    throw new Error('Impossible de créer l\'intention de paiement');
  }
}

// Fonction pour confirmer un paiement
export async function confirmPayment(paymentIntentId: string) {
  try {
    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);
    return paymentIntent.status === 'succeeded';
  } catch (error) {
    console.error('Erreur lors de la confirmation du paiement:', error);
    return false;
  }
}

// Fonction pour annuler un Payment Intent
export async function cancelPaymentIntent(paymentIntentId: string) {
  try {
    await stripe.paymentIntents.cancel(paymentIntentId);
    return true;
  } catch (error) {
    console.error('Erreur lors de l\'annulation du paiement:', error);
    return false;
  }
}
