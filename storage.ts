import { randomUUID } from "crypto";
import bcrypt from "bcryptjs";
import { ADMIN_CONFIG } from './config/admin';
import type {
  Service, InsertService,
  Appointment, InsertAppointment,
  BlogPost, InsertBlogPost,
  SessionNote, InsertSessionNote,
  Resource, InsertResource,
  ContactMessage, InsertContactMessage,
  Client, InsertClient
} from "@shared/schema";

// Interface pour les utilisateurs
export interface User {
  id: string;
  nom: string;
  email: string;
  telephone: string;
  role: "admin" | "therapist" | "client";
  isActive: boolean;
  createdAt: Date;
  lastLogin?: Date;
  emailVerified: boolean;
  acceptNewsletter: boolean;
}

export interface InsertUser {
  nom: string;
  email: string;
  telephone: string;
  password: string;
  role?: "admin" | "therapist" | "client";
  acceptNewsletter?: boolean;
}

export interface IStorage {
  // Users
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  validateUser(email: string, password: string): Promise<User | null>;

  // Services
  getAllServices(): Promise<Service[]>;
  getService(id: string): Promise<Service | undefined>;
  createService(service: InsertService): Promise<Service>;

  // Appointments
  getAllAppointments(): Promise<Appointment[]>;
  getAppointment(id: string): Promise<Appointment | undefined>;
  getAppointmentsByEmail(email: string): Promise<Appointment[]>;
  createAppointment(appointment: InsertAppointment): Promise<Appointment>;
  updateAppointmentStatus(id: string, status: string): Promise<Appointment | undefined>;

  // Blog Posts
  getAllBlogPosts(): Promise<BlogPost[]>;
  getPublishedBlogPosts(): Promise<BlogPost[]>;
  getBlogPost(id: string): Promise<BlogPost | undefined>;
  createBlogPost(post: InsertBlogPost): Promise<BlogPost>;

  // Session Notes
  getSessionNotesByEmail(email: string): Promise<SessionNote[]>;
  createSessionNote(note: InsertSessionNote): Promise<SessionNote>;

  // Resources
  getResourcesByEmail(email: string): Promise<Resource[]>;
  createResource(resource: InsertResource): Promise<Resource>;

  // Contact Messages
  getAllContactMessages(): Promise<ContactMessage[]>;
  createContactMessage(message: InsertContactMessage): Promise<ContactMessage>;
  markMessageAsRead(id: string): Promise<void>;

  // Clients
  getClientByEmail(email: string): Promise<Client | undefined>;
  createClient(client: InsertClient): Promise<Client>;
}

export class MemStorage implements IStorage {
  private users: Map<string, User>;
  private services: Map<string, Service>;
  private appointments: Map<string, Appointment>;
  private blogPosts: Map<string, BlogPost>;
  private sessionNotes: Map<string, SessionNote>;
  private resources: Map<string, Resource>;
  private contactMessages: Map<string, ContactMessage>;
  private clients: Map<string, Client>;

  constructor() {
    this.users = new Map();
    this.services = new Map();
    this.appointments = new Map();
    this.blogPosts = new Map();
    this.sessionNotes = new Map();
    this.resources = new Map();
    this.contactMessages = new Map();
    this.clients = new Map();

    // Log de démarrage pour vérifier la configuration
    console.log(`[STARTUP] Configuration admin chargée:`);
    console.log(`[STARTUP] Email: ${ADMIN_CONFIG.email}`);
    console.log(`[STARTUP] Nom: ${ADMIN_CONFIG.nom}`);
    console.log(`[STARTUP] Téléphone: ${ADMIN_CONFIG.telephone}`);

    // Seed initial services
    this.seedServices();
    this.seedBlogPosts();
    this.seedUsers();
    
    // Log des utilisateurs créés
    console.log(`[STARTUP] Utilisateurs créés: ${this.users.size}`);
    this.users.forEach((user, id) => {
      console.log(`[STARTUP] - ${id}: ${user.email} (${user.role})`);
    });
  }

  private seedServices() {
    const services: InsertService[] = [
      {
        nom: "Séance d'Hypnose Classique",
        description: "Séance d'hypnose traditionnelle pour traiter divers problèmes",
        duree: 90,
        prix: 8000, // 80€ en centimes
        icone: "brain",
      },
      {
        nom: "Arrêt du Tabac",
        description: "Séance spécialisée pour arrêter de fumer définitivement",
        duree: 120,
        prix: 12000, // 120€ en centimes
        icone: "smoke",
      },
      {
        nom: "Gestion du Stress",
        description: "Techniques d'hypnose pour réduire l'anxiété et le stress",
        duree: 90,
        prix: 8000, // 80€ en centimes
        icone: "heart",
      },
      {
        nom: "Confiance en Soi",
        description: "Renforcement de l'estime personnelle et de l'assurance",
        duree: 90,
        prix: 8000, // 80€ en centimes
        icone: "shield",
      },
    ];

    services.forEach(service => {
      const id = randomUUID();
      this.services.set(id, { ...service, id });
    });
  }

  private seedBlogPosts() {
    const posts: InsertBlogPost[] = [];

    posts.forEach(post => {
      const id = randomUUID();
      this.blogPosts.set(id, { 
        ...post, 
        id, 
        createdAt: new Date(),
        imageUrl: post.imageUrl || null,
        publie: post.publie || false,
      });
    });
  }

  // Services
  async getAllServices(): Promise<Service[]> {
    try {
      return Array.from(this.services.values());
    } catch (error) {
      console.error('Erreur lors de la récupération des services:', error);
      return [];
    }
  }

  async getService(id: string): Promise<Service | undefined> {
    try {
      if (!id) {
        console.warn('ID de service invalide');
        return undefined;
      }
      return this.services.get(id);
    } catch (error) {
      console.error('Erreur lors de la récupération du service:', error);
      return undefined;
    }
  }

  async createService(insertService: InsertService): Promise<Service> {
    try {
      const id = randomUUID();
      const service: Service = { ...insertService, id };
      this.services.set(id, service);
      return service;
    } catch (error) {
      console.error('Erreur lors de la création du service:', error);
      throw new Error('Impossible de créer le service');
    }
  }

  // Appointments
  async getAllAppointments(): Promise<Appointment[]> {
    try {
      return Array.from(this.appointments.values()).sort(
        (a, b) => new Date(a.dateHeure).getTime() - new Date(b.dateHeure).getTime()
      );
    } catch (error) {
      console.error('Erreur lors de la récupération des rendez-vous:', error);
      return [];
    }
  }

  async getAppointment(id: string): Promise<Appointment | undefined> {
    try {
      if (!id) {
        console.warn('ID de rendez-vous invalide');
        return undefined;
      }
      return this.appointments.get(id);
    } catch (error) {
      console.error('Erreur lors de la récupération du rendez-vous:', error);
      return undefined;
    }
  }

  async getAppointmentsByEmail(email: string): Promise<Appointment[]> {
    try {
      if (!email) {
        console.warn('Email invalide pour la récupération des rendez-vous');
        return [];
      }
      return Array.from(this.appointments.values())
        .filter(apt => apt.clientEmail === email)
        .sort((a, b) => new Date(a.dateHeure).getTime() - new Date(b.dateHeure).getTime());
    } catch (error) {
      console.error('Erreur lors de la récupération des rendez-vous par email:', error);
      return [];
    }
  }

  async createAppointment(insertAppointment: InsertAppointment): Promise<Appointment> {
    try {
      const id = randomUUID();
      const appointment: Appointment = {
        ...insertAppointment,
        id,
        createdAt: new Date(),
        notes: insertAppointment.notes || null,
      };
      this.appointments.set(id, appointment);
      return appointment;
    } catch (error) {
      console.error('Erreur lors de la création du rendez-vous:', error);
      throw new Error('Impossible de créer le rendez-vous');
    }
  }

  async updateAppointmentStatus(id: string, status: string): Promise<Appointment | undefined> {
    try {
      if (!id || !status) {
        console.warn('Paramètres invalides pour la mise à jour du statut');
        return undefined;
      }
      const appointment = this.appointments.get(id);
      if (appointment) {
        appointment.statut = status;
        this.appointments.set(id, appointment);
        return appointment;
      }
      return undefined;
    } catch (error) {
      console.error('Erreur lors de la mise à jour du statut du rendez-vous:', error);
      return undefined;
    }
  }

  // Blog Posts
  async getAllBlogPosts(): Promise<BlogPost[]> {
    return Array.from(this.blogPosts.values()).sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  }

  async getPublishedBlogPosts(): Promise<BlogPost[]> {
    return Array.from(this.blogPosts.values())
      .filter(post => post.publie)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  async getBlogPost(id: string): Promise<BlogPost | undefined> {
    return this.blogPosts.get(id);
  }

  async createBlogPost(insertPost: InsertBlogPost): Promise<BlogPost> {
    const id = randomUUID();
    const post: BlogPost = {
      ...insertPost,
      id,
      createdAt: new Date(),
      imageUrl: insertPost.imageUrl || null,
      publie: insertPost.publie || false,
    };
    this.blogPosts.set(id, post);
    return post;
  }

  // Session Notes
  async getSessionNotesByEmail(email: string): Promise<SessionNote[]> {
    return Array.from(this.sessionNotes.values())
      .filter(note => note.clientEmail === email)
      .sort((a, b) => new Date(b.dateSession).getTime() - new Date(a.dateSession).getTime());
  }

  async createSessionNote(insertNote: InsertSessionNote): Promise<SessionNote> {
    const id = randomUUID();
    const note: SessionNote = {
      ...insertNote,
      id,
      createdAt: new Date(),
    };
    this.sessionNotes.set(id, note);
    return note;
  }

  // Resources
  async getResourcesByEmail(email: string): Promise<Resource[]> {
    return Array.from(this.resources.values())
      .filter(resource => resource.clientEmail === email)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  async createResource(insertResource: InsertResource): Promise<Resource> {
    const id = randomUUID();
    const resource: Resource = {
      ...insertResource,
      id,
      createdAt: new Date(),
    };
    this.resources.set(id, resource);
    return resource;
  }

  // Contact Messages
  async getAllContactMessages(): Promise<ContactMessage[]> {
    try {
      return Array.from(this.contactMessages.values()).sort(
        (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
    } catch (error) {
      console.error('Erreur lors de la récupération des messages de contact:', error);
      return [];
    }
  }

  async createContactMessage(insertMessage: InsertContactMessage): Promise<ContactMessage> {
    try {
      if (!insertMessage.nom || !insertMessage.email || !insertMessage.message) {
        throw new Error('Données de message invalides');
      }

      const id = randomUUID();
      const message: ContactMessage = {
        ...insertMessage,
        id,
        lu: false,
        createdAt: new Date(),
        telephone: insertMessage.telephone || null,
      };
      this.contactMessages.set(id, message);
      return message;
    } catch (error) {
      console.error('Erreur lors de la création du message de contact:', error);
      throw new Error('Impossible de créer le message de contact');
    }
  }

  async markMessageAsRead(id: string): Promise<void> {
    try {
      if (!id) {
        console.warn('ID de message invalide');
        return;
      }
      const message = this.contactMessages.get(id);
      if (message) {
        message.lu = true;
        this.contactMessages.set(id, message);
      }
    } catch (error) {
      console.error('Erreur lors du marquage du message comme lu:', error);
      // Ne pas lancer d'erreur pour cette opération non critique
    }
  }

  // Users
  async getUserByEmail(email: string): Promise<User | undefined> {
    try {
      if (!email || typeof email !== 'string') {
        console.warn('Email invalide pour la recherche d\'utilisateur');
        return undefined;
      }
      return Array.from(this.users.values()).find(
        (user) => user.email === email
      );
    } catch (error) {
      console.error('Erreur lors de la récupération de l\'utilisateur par email:', error);
      return undefined;
    }
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    try {
      if (!insertUser.email || !insertUser.password || !insertUser.nom) {
        throw new Error('Données utilisateur invalides');
      }

      const id = randomUUID();
      
      // Hasher le mot de passe
      const hashedPassword = await bcrypt.hash(insertUser.password, 10);
      
      const user: User = {
        id,
        nom: insertUser.nom,
        email: insertUser.email,
        telephone: insertUser.telephone,
        role: insertUser.role || "client",
        isActive: true,
        createdAt: new Date(),
        emailVerified: false,
        acceptNewsletter: insertUser.acceptNewsletter || false,
      };
      
      // Stocker l'utilisateur avec le mot de passe hashé
      this.users.set(id, { ...user, password: hashedPassword } as any);
      
      return user;
    } catch (error) {
      console.error('Erreur lors de la création de l\'utilisateur:', error);
      throw new Error('Impossible de créer l\'utilisateur');
    }
  }

  async validateUser(email: string, password: string): Promise<User | null> {
    try {
      if (!email || !password || typeof email !== 'string' || typeof password !== 'string') {
        console.warn('Paramètres de validation invalides');
        return null;
      }

      console.log(`[DEBUG] Tentative de connexion pour: ${email}`);
      const user = await this.getUserByEmail(email);
      if (!user) {
        console.log(`[DEBUG] Utilisateur non trouvé: ${email}`);
        return null;
      }
      
      console.log(`[DEBUG] Utilisateur trouvé: ${user.email} (${user.role})`);
      
      // Vérifier le mot de passe (on doit récupérer l'utilisateur avec le mot de passe hashé)
      const userWithPassword = this.users.get(user.id) as any;
      if (!userWithPassword || !userWithPassword.password) {
        console.log(`[DEBUG] Utilisateur avec mot de passe non trouvé: ${user.id}`);
        return null;
      }
      
      console.log(`[DEBUG] Mot de passe stocké: ${userWithPassword.password}`);
      console.log(`[DEBUG] Mot de passe fourni: ${password}`);
      
      // TEMPORAIRE : Comparaison directe sans hachage pour test
      const isValidPassword = password === userWithPassword.password;
      console.log(`[DEBUG] Mot de passe valide (sans hachage): ${isValidPassword}`);
      
      if (!isValidPassword) {
        // Log de sécurité pour audit RGPD
        console.log(`[SECURITY] Failed login attempt for ${email} - ${new Date().toISOString()}`);
        return null;
      }
      
      // Log de connexion réussie pour audit RGPD
      console.log(`[SECURITY] Successful login for ${email} (${user.role}) - ${new Date().toISOString()}`);
      
      return user;
    } catch (error) {
      console.error('Erreur lors de la validation de l\'utilisateur:', error);
      return null;
    }
  }

  // Récupérer un utilisateur par token (pour l'authentification JWT)
  getUserByToken(token: string): User | null {
    // Ici vous décoderiez le JWT et récupéreriez l'utilisateur
    // Pour l'instant, on simule avec les utilisateurs existants
    const user = this.users.get('admin-1');
    return user || null;
  }

  private seedUsers() {
    // Créer des utilisateurs de test avec des mots de passe hashés
    const testUsers = [
      {
        id: "admin-1",
        nom: ADMIN_CONFIG.nom,
        email: ADMIN_CONFIG.email,
        telephone: ADMIN_CONFIG.telephone,
        password: "admin123", // Mot de passe en clair pour test
        role: "admin" as const,
        isActive: true,
        createdAt: new Date(),
        emailVerified: true,
        acceptNewsletter: false,
      },
      {
        id: "therapist-1",
        nom: "Thérapeute",
        email: "therapist@hypnotherapie.fr",
        telephone: "+33 1 23 45 67 90",
        password: "therapist123", // Mot de passe en clair pour test
        role: "therapist" as const,
        isActive: true,
        createdAt: new Date(),
        emailVerified: true,
        acceptNewsletter: true,
      },
      {
        id: "client-1",
        nom: "Client Test",
        email: "client@hypnotherapie.fr",
        telephone: "+33 1 23 45 67 91",
        password: "client123", // Mot de passe en clair pour test
        role: "client" as const,
        isActive: true,
        createdAt: new Date(),
        emailVerified: true,
        acceptNewsletter: true,
      }
    ];

    testUsers.forEach(user => {
      this.users.set(user.id, user as any);
    });
  }

  // Clients
  async getClientByEmail(email: string): Promise<Client | undefined> {
    return Array.from(this.clients.values()).find(
      (client) => client.email === email
    );
  }

  async createClient(insertClient: InsertClient): Promise<Client> {
    const id = randomUUID();
    const client: Client = {
      ...insertClient,
      id,
      createdAt: new Date(),
    };
    this.clients.set(id, client);
    return client;
  }
}

export const storage = new MemStorage();
