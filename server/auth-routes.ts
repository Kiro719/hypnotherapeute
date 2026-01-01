// Routes d'authentification pour le serveur Express
import { Router } from 'express';
import { loginUser, registerUser, verifyToken, requireAuth, requireRole } from './auth-server';

const authRouter = Router();

// Route de connexion
authRouter.post('/login', async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'Email et mot de passe requis' });
  }

  const result = await loginUser({ email, password });
  
  if (result.success) {
    res.json({
      message: 'Connexion réussie',
      user: result.user,
      token: result.token
    });
  } else {
    res.status(401).json({ error: result.error });
  }
});

// Route d'inscription
authRouter.post('/register', async (req, res) => {
  const { email, password, nom, role } = req.body;

  if (!email || !password || !nom) {
    return res.status(400).json({ error: 'Email, mot de passe et nom requis' });
  }

  // Validation du mot de passe
  if (password.length < 8) {
    return res.status(400).json({ error: 'Le mot de passe doit contenir au moins 8 caractères' });
  }

  const result = await registerUser({ email, password, nom, role });
  
  if (result.success) {
    res.status(201).json({
      message: 'Inscription réussie',
      user: result.user
    });
  } else {
    res.status(400).json({ error: result.error });
  }
});

// Route pour vérifier le token (profil utilisateur)
authRouter.get('/me', requireAuth, (req: any, res) => {
  res.json({
    user: req.user
  });
});

// Route pour créer un utilisateur admin (seulement pour les admins)
authRouter.post('/create-admin', requireAuth, requireRole(['admin']), async (req, res) => {
  const { email, password, nom } = req.body;

  if (!email || !password || !nom) {
    return res.status(400).json({ error: 'Email, mot de passe et nom requis' });
  }

  const result = await registerUser({ email, password, nom, role: 'admin' });
  
  if (result.success) {
    res.status(201).json({
      message: 'Administrateur créé avec succès',
      user: result.user
    });
  } else {
    res.status(400).json({ error: result.error });
  }
});

// Route pour créer un thérapeute (seulement pour les admins)
authRouter.post('/create-therapist', requireAuth, requireRole(['admin']), async (req, res) => {
  const { email, password, nom } = req.body;

  if (!email || !password || !nom) {
    return res.status(400).json({ error: 'Email, mot de passe et nom requis' });
  }

  const result = await registerUser({ email, password, nom, role: 'therapist' });
  
  if (result.success) {
    res.status(201).json({
      message: 'Thérapeute créé avec succès',
      user: result.user
    });
  } else {
    res.status(400).json({ error: result.error });
  }
});

// Route de déconnexion (optionnel, car JWT est stateless)
authRouter.post('/logout', requireAuth, (req, res) => {
  // Dans un système JWT stateless, la déconnexion se fait côté client
  // En supprimant le token du localStorage
  res.json({ message: 'Déconnexion réussie' });
});

export default authRouter;