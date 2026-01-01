import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
// import authRouter from "./auth-routes"; // Désactivé temporairement pour utiliser notre système en mémoire
import { 
  insertServiceSchema,
  insertAppointmentSchema,
  insertBlogPostSchema,
  insertSessionNoteSchema,
  insertResourceSchema,
  insertContactMessageSchema,
  insertClientSchema
} from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  // Routes d'authentification - Désactivé temporairement
  // app.use('/api/auth', authRouter);
  
  // Route d'inscription
  app.post("/api/auth/register", async (req, res) => {
    try {
      const { nom, prenom, email, telephone, password, acceptNewsletter } = req.body;
      
      // Validation des données
      if (!nom || !prenom || !email || !telephone || !password) {
        return res.status(400).json({ error: "Tous les champs sont requis" });
      }
      
      // Vérifier si l'email existe déjà
      const existingUser = await storage.getUserByEmail(email);
      if (existingUser) {
        return res.status(409).json({ error: "Un compte avec cet email existe déjà" });
      }
      
      // Créer l'utilisateur avec le rôle "client" par défaut
      const userData = {
        nom: `${prenom} ${nom}`,
        email,
        telephone,
        password, // Le mot de passe sera hashé dans storage
        role: "client" as const, // Rôle par défaut pour les nouveaux utilisateurs
        acceptNewsletter: acceptNewsletter || false
      };
      
      const newUser = await storage.createUser(userData);
      
      // Retourner les données sans le mot de passe
      const userWithoutPassword = {
        id: newUser.id,
        nom: newUser.nom,
        email: newUser.email,
        telephone: newUser.telephone,
        role: newUser.role,
        isActive: newUser.isActive,
        createdAt: newUser.createdAt,
        emailVerified: newUser.emailVerified,
        acceptNewsletter: newUser.acceptNewsletter
      };
      res.status(201).json({
        message: "Compte créé avec succès",
        user: userWithoutPassword
      });
      
    } catch (error) {
      console.error("Erreur lors de l'inscription:", error);
      res.status(500).json({ error: "Erreur lors de la création du compte" });
    }
  });

  // Route de connexion
  app.post("/api/auth/login", async (req, res) => {
    try {
      console.log(`[LOGIN] Tentative de connexion reçue`);
      const { email, password } = req.body;
      console.log(`[LOGIN] Email reçu: ${email}`);
      console.log(`[LOGIN] Mot de passe reçu: ${password ? '[présent]' : '[absent]'}`);
      
      // Validation des données
      if (!email || !password) {
        console.log(`[LOGIN] Données manquantes - Email: ${!!email}, Password: ${!!password}`);
        return res.status(400).json({ error: "Email et mot de passe requis" });
      }
      
      console.log(`[LOGIN] Appel de storage.validateUser...`);
      // Valider les identifiants
      const user = await storage.validateUser(email, password);
      console.log(`[LOGIN] Résultat de validateUser:`, user ? `Utilisateur trouvé (${user.role})` : 'Aucun utilisateur');
      
      if (!user) {
        console.log(`[LOGIN] Aucun utilisateur trouvé, retour 401`);
        return res.status(401).json({ error: "Email ou mot de passe incorrect" });
      }
      
      // Vérifier que le compte est actif
      if (!user.isActive) {
        return res.status(403).json({ error: "Compte désactivé" });
      }
      
      // Retourner les données utilisateur (sans le mot de passe)
      res.json({
        message: "Connexion réussie",
        user: {
          id: user.id,
          nom: user.nom,
          email: user.email,
          telephone: user.telephone,
          role: user.role,
          isActive: user.isActive,
          createdAt: user.createdAt,
          emailVerified: user.emailVerified,
          acceptNewsletter: user.acceptNewsletter
        }
      });
      
    } catch (error) {
      console.error("Erreur lors de la connexion:", error);
      res.status(500).json({ error: "Erreur lors de la connexion" });
    }
  });
  // Services Routes
  app.get("/api/services", async (_req, res) => {
    try {
      const services = await storage.getAllServices();
      res.json(services);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch services" });
    }
  });

  app.get("/api/services/:id", async (req, res) => {
    try {
      const service = await storage.getService(req.params.id);
      if (!service) {
        return res.status(404).json({ error: "Service not found" });
      }
      res.json(service);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch service" });
    }
  });

  app.post("/api/services", async (req, res) => {
    try {
      const validatedData = insertServiceSchema.parse(req.body);
      const service = await storage.createService(validatedData);
      res.status(201).json(service);
    } catch (error) {
      res.status(400).json({ error: "Invalid service data" });
    }
  });

  // Appointments Routes
  app.get("/api/appointments", async (_req, res) => {
    try {
      const appointments = await storage.getAllAppointments();
      res.json(appointments);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch appointments" });
    }
  });

  app.get("/api/appointments/:id", async (req, res) => {
    try {
      const appointment = await storage.getAppointment(req.params.id);
      if (!appointment) {
        return res.status(404).json({ error: "Appointment not found" });
      }
      res.json(appointment);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch appointment" });
    }
  });

  app.post("/api/appointments", async (req, res) => {
    try {
      const validatedData = insertAppointmentSchema.parse(req.body);
      const appointment = await storage.createAppointment(validatedData);
      res.status(201).json(appointment);
    } catch (error: any) {
      if (error?.issues) {
        return res.status(400).json({ error: "Validation error", details: error.issues });
      }
      res.status(400).json({ error: "Invalid appointment data", message: error?.message || "Unknown error" });
    }
  });

  app.patch("/api/appointments/:id/status", async (req, res) => {
    try {
      const { status } = req.body;
      if (!status) {
        return res.status(400).json({ error: "Status is required" });
      }
      const appointment = await storage.updateAppointmentStatus(req.params.id, status);
      if (!appointment) {
        return res.status(404).json({ error: "Appointment not found" });
      }
      res.json(appointment);
    } catch (error) {
      res.status(500).json({ error: "Failed to update appointment status" });
    }
  });

  // Blog Posts Routes
  app.get("/api/blog/posts", async (_req, res) => {
    try {
      const posts = await storage.getPublishedBlogPosts();
      res.json(posts);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch blog posts" });
    }
  });

  app.get("/api/blog/posts/:id", async (req, res) => {
    try {
      const post = await storage.getBlogPost(req.params.id);
      if (!post) {
        return res.status(404).json({ error: "Blog post not found" });
      }
      res.json(post);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch blog post" });
    }
  });

  app.get("/api/blog/posts/all", async (_req, res) => {
    try {
      const posts = await storage.getAllBlogPosts();
      res.json(posts);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch all blog posts" });
    }
  });

  app.post("/api/blog/posts", async (req, res) => {
    try {
      const validatedData = insertBlogPostSchema.parse(req.body);
      const post = await storage.createBlogPost(validatedData);
      res.status(201).json(post);
    } catch (error) {
      res.status(400).json({ error: "Invalid blog post data" });
    }
  });

  // Contact Messages Routes
  app.get("/api/contact", async (_req, res) => {
    try {
      const messages = await storage.getAllContactMessages();
      res.json(messages);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch contact messages" });
    }
  });

  app.post("/api/contact", async (req, res) => {
    try {
      const validatedData = insertContactMessageSchema.parse(req.body);
      const message = await storage.createContactMessage(validatedData);
      res.status(201).json(message);
    } catch (error) {
      res.status(400).json({ error: "Invalid contact message data" });
    }
  });

  app.patch("/api/contact/:id/read", async (req, res) => {
    try {
      await storage.markMessageAsRead(req.params.id);
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ error: "Failed to mark message as read" });
    }
  });

  // Client Portal Routes
  app.get("/api/portal/appointments/:email", async (req, res) => {
    try {
      const appointments = await storage.getAppointmentsByEmail(req.params.email);
      res.json(appointments);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch client appointments" });
    }
  });

  app.get("/api/portal/notes/:email", async (req, res) => {
    try {
      const notes = await storage.getSessionNotesByEmail(req.params.email);
      res.json(notes);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch session notes" });
    }
  });

  app.post("/api/portal/notes", async (req, res) => {
    try {
      const validatedData = insertSessionNoteSchema.parse(req.body);
      const note = await storage.createSessionNote(validatedData);
      res.status(201).json(note);
    } catch (error) {
      res.status(400).json({ error: "Invalid session note data" });
    }
  });

  app.get("/api/portal/resources/:email", async (req, res) => {
    try {
      const resources = await storage.getResourcesByEmail(req.params.email);
      res.json(resources);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch resources" });
    }
  });

  app.post("/api/portal/resources", async (req, res) => {
    try {
      const validatedData = insertResourceSchema.parse(req.body);
      const resource = await storage.createResource(validatedData);
      res.status(201).json(resource);
    } catch (error) {
      res.status(400).json({ error: "Invalid resource data" });
    }
  });

  // Client Authentication Routes
  app.get("/api/clients/:email", async (req, res) => {
    try {
      const client = await storage.getClientByEmail(req.params.email);
      if (!client) {
        return res.status(404).json({ error: "Client not found" });
      }
      res.json(client);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch client" });
    }
  });

  app.post("/api/clients", async (req, res) => {
    try {
      const validatedData = insertClientSchema.parse(req.body);
      const client = await storage.createClient(validatedData);
      res.status(201).json(client);
    } catch (error) {
      res.status(400).json({ error: "Invalid client data" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
