// server/index.ts
import express2 from "express";

// server/routes.ts
import { createServer } from "http";

// server/storage.ts
import { randomUUID } from "crypto";
var MemStorage = class {
  services;
  appointments;
  blogPosts;
  sessionNotes;
  resources;
  contactMessages;
  clients;
  constructor() {
    this.services = /* @__PURE__ */ new Map();
    this.appointments = /* @__PURE__ */ new Map();
    this.blogPosts = /* @__PURE__ */ new Map();
    this.sessionNotes = /* @__PURE__ */ new Map();
    this.resources = /* @__PURE__ */ new Map();
    this.contactMessages = /* @__PURE__ */ new Map();
    this.clients = /* @__PURE__ */ new Map();
    this.seedServices();
    this.seedBlogPosts();
  }
  seedServices() {
    const services2 = [];
    services2.forEach((service) => {
      const id = randomUUID();
      this.services.set(id, { ...service, id });
    });
  }
  seedBlogPosts() {
    const posts = [];
    posts.forEach((post) => {
      const id = randomUUID();
      this.blogPosts.set(id, {
        ...post,
        id,
        createdAt: /* @__PURE__ */ new Date()
      });
    });
  }
  // Services
  async getAllServices() {
    return Array.from(this.services.values());
  }
  async getService(id) {
    return this.services.get(id);
  }
  async createService(insertService) {
    const id = randomUUID();
    const service = { ...insertService, id };
    this.services.set(id, service);
    return service;
  }
  // Appointments
  async getAllAppointments() {
    return Array.from(this.appointments.values()).sort(
      (a, b) => new Date(a.dateHeure).getTime() - new Date(b.dateHeure).getTime()
    );
  }
  async getAppointment(id) {
    return this.appointments.get(id);
  }
  async getAppointmentsByEmail(email) {
    return Array.from(this.appointments.values()).filter((apt) => apt.clientEmail === email).sort((a, b) => new Date(a.dateHeure).getTime() - new Date(b.dateHeure).getTime());
  }
  async createAppointment(insertAppointment) {
    const id = randomUUID();
    const appointment = {
      ...insertAppointment,
      id,
      createdAt: /* @__PURE__ */ new Date()
    };
    this.appointments.set(id, appointment);
    return appointment;
  }
  async updateAppointmentStatus(id, status) {
    const appointment = this.appointments.get(id);
    if (appointment) {
      appointment.statut = status;
      this.appointments.set(id, appointment);
      return appointment;
    }
    return void 0;
  }
  // Blog Posts
  async getAllBlogPosts() {
    return Array.from(this.blogPosts.values()).sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  }
  async getPublishedBlogPosts() {
    return Array.from(this.blogPosts.values()).filter((post) => post.publie).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }
  async getBlogPost(id) {
    return this.blogPosts.get(id);
  }
  async createBlogPost(insertPost) {
    const id = randomUUID();
    const post = {
      ...insertPost,
      id,
      createdAt: /* @__PURE__ */ new Date()
    };
    this.blogPosts.set(id, post);
    return post;
  }
  // Session Notes
  async getSessionNotesByEmail(email) {
    return Array.from(this.sessionNotes.values()).filter((note) => note.clientEmail === email).sort((a, b) => new Date(b.dateSession).getTime() - new Date(a.dateSession).getTime());
  }
  async createSessionNote(insertNote) {
    const id = randomUUID();
    const note = {
      ...insertNote,
      id,
      createdAt: /* @__PURE__ */ new Date()
    };
    this.sessionNotes.set(id, note);
    return note;
  }
  // Resources
  async getResourcesByEmail(email) {
    return Array.from(this.resources.values()).filter((resource) => resource.clientEmail === email).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }
  async createResource(insertResource) {
    const id = randomUUID();
    const resource = {
      ...insertResource,
      id,
      createdAt: /* @__PURE__ */ new Date()
    };
    this.resources.set(id, resource);
    return resource;
  }
  // Contact Messages
  async getAllContactMessages() {
    return Array.from(this.contactMessages.values()).sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  }
  async createContactMessage(insertMessage) {
    const id = randomUUID();
    const message = {
      ...insertMessage,
      id,
      lu: false,
      createdAt: /* @__PURE__ */ new Date()
    };
    this.contactMessages.set(id, message);
    return message;
  }
  async markMessageAsRead(id) {
    const message = this.contactMessages.get(id);
    if (message) {
      message.lu = true;
      this.contactMessages.set(id, message);
    }
  }
  // Clients
  async getClientByEmail(email) {
    return Array.from(this.clients.values()).find(
      (client) => client.email === email
    );
  }
  async createClient(insertClient) {
    const id = randomUUID();
    const client = {
      ...insertClient,
      id,
      createdAt: /* @__PURE__ */ new Date()
    };
    this.clients.set(id, client);
    return client;
  }
};
var storage = new MemStorage();

// shared/schema.ts
import { sql } from "drizzle-orm";
import { pgTable, text, varchar, timestamp, integer, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
var services = pgTable("services", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  nom: text("nom").notNull(),
  description: text("description").notNull(),
  duree: integer("duree").notNull(),
  // en minutes
  prix: integer("prix").notNull(),
  // en centimes d'euros
  icone: text("icone").notNull()
  // nom de l'icône lucide-react
});
var insertServiceSchema = createInsertSchema(services).omit({ id: true });
var appointments = pgTable("appointments", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  serviceId: varchar("service_id").notNull(),
  clientNom: text("client_nom").notNull(),
  clientEmail: text("client_email").notNull(),
  clientTelephone: text("client_telephone").notNull(),
  dateHeure: timestamp("date_heure").notNull(),
  statut: text("statut").notNull().default("confirme"),
  // confirme, annule, termine
  notes: text("notes"),
  createdAt: timestamp("created_at").notNull().default(sql`now()`)
});
var insertAppointmentSchema = z.object({
  serviceId: z.string().min(1),
  clientNom: z.string().min(1),
  clientEmail: z.string().email(),
  clientTelephone: z.string().min(1),
  dateHeure: z.coerce.date(),
  statut: z.string().default("confirme"),
  notes: z.string().optional()
});
var blogPosts = pgTable("blog_posts", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  titre: text("titre").notNull(),
  contenu: text("contenu").notNull(),
  extrait: text("extrait").notNull(),
  categorie: text("categorie").notNull(),
  imageUrl: text("image_url"),
  tempsDeLecture: integer("temps_de_lecture").notNull(),
  // en minutes
  publie: boolean("publie").notNull().default(false),
  createdAt: timestamp("created_at").notNull().default(sql`now()`)
});
var insertBlogPostSchema = createInsertSchema(blogPosts).omit({
  id: true,
  createdAt: true
});
var sessionNotes = pgTable("session_notes", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  clientEmail: text("client_email").notNull(),
  titre: text("titre").notNull(),
  contenu: text("contenu").notNull(),
  dateSession: timestamp("date_session").notNull(),
  createdAt: timestamp("created_at").notNull().default(sql`now()`)
});
var insertSessionNoteSchema = createInsertSchema(sessionNotes).omit({
  id: true,
  createdAt: true
});
var resources = pgTable("resources", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  clientEmail: text("client_email").notNull(),
  titre: text("titre").notNull(),
  description: text("description").notNull(),
  type: text("type").notNull(),
  // audio, video, pdf, lien
  url: text("url").notNull(),
  createdAt: timestamp("created_at").notNull().default(sql`now()`)
});
var insertResourceSchema = createInsertSchema(resources).omit({
  id: true,
  createdAt: true
});
var contactMessages = pgTable("contact_messages", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  nom: text("nom").notNull(),
  email: text("email").notNull(),
  telephone: text("telephone"),
  message: text("message").notNull(),
  lu: boolean("lu").notNull().default(false),
  createdAt: timestamp("created_at").notNull().default(sql`now()`)
});
var insertContactMessageSchema = createInsertSchema(contactMessages).omit({
  id: true,
  createdAt: true,
  lu: true
});
var clients = pgTable("clients", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  nom: text("nom").notNull(),
  email: text("email").notNull().unique(),
  code: text("code").notNull(),
  // code d'accès simple
  createdAt: timestamp("created_at").notNull().default(sql`now()`)
});
var insertClientSchema = createInsertSchema(clients).omit({
  id: true,
  createdAt: true
});

// server/routes.ts
async function registerRoutes(app2) {
  app2.get("/api/services", async (_req, res) => {
    try {
      const services2 = await storage.getAllServices();
      res.json(services2);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch services" });
    }
  });
  app2.get("/api/services/:id", async (req, res) => {
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
  app2.post("/api/services", async (req, res) => {
    try {
      const validatedData = insertServiceSchema.parse(req.body);
      const service = await storage.createService(validatedData);
      res.status(201).json(service);
    } catch (error) {
      res.status(400).json({ error: "Invalid service data" });
    }
  });
  app2.get("/api/appointments", async (_req, res) => {
    try {
      const appointments2 = await storage.getAllAppointments();
      res.json(appointments2);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch appointments" });
    }
  });
  app2.get("/api/appointments/:id", async (req, res) => {
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
  app2.post("/api/appointments", async (req, res) => {
    try {
      const validatedData = insertAppointmentSchema.parse(req.body);
      const appointment = await storage.createAppointment(validatedData);
      res.status(201).json(appointment);
    } catch (error) {
      if (error?.issues) {
        return res.status(400).json({ error: "Validation error", details: error.issues });
      }
      res.status(400).json({ error: "Invalid appointment data", message: error?.message || "Unknown error" });
    }
  });
  app2.patch("/api/appointments/:id/status", async (req, res) => {
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
  app2.get("/api/blog/posts", async (_req, res) => {
    try {
      const posts = await storage.getPublishedBlogPosts();
      res.json(posts);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch blog posts" });
    }
  });
  app2.get("/api/blog/posts/:id", async (req, res) => {
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
  app2.get("/api/blog/posts/all", async (_req, res) => {
    try {
      const posts = await storage.getAllBlogPosts();
      res.json(posts);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch all blog posts" });
    }
  });
  app2.post("/api/blog/posts", async (req, res) => {
    try {
      const validatedData = insertBlogPostSchema.parse(req.body);
      const post = await storage.createBlogPost(validatedData);
      res.status(201).json(post);
    } catch (error) {
      res.status(400).json({ error: "Invalid blog post data" });
    }
  });
  app2.get("/api/contact", async (_req, res) => {
    try {
      const messages = await storage.getAllContactMessages();
      res.json(messages);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch contact messages" });
    }
  });
  app2.post("/api/contact", async (req, res) => {
    try {
      const validatedData = insertContactMessageSchema.parse(req.body);
      const message = await storage.createContactMessage(validatedData);
      res.status(201).json(message);
    } catch (error) {
      res.status(400).json({ error: "Invalid contact message data" });
    }
  });
  app2.patch("/api/contact/:id/read", async (req, res) => {
    try {
      await storage.markMessageAsRead(req.params.id);
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ error: "Failed to mark message as read" });
    }
  });
  app2.get("/api/portal/appointments/:email", async (req, res) => {
    try {
      const appointments2 = await storage.getAppointmentsByEmail(req.params.email);
      res.json(appointments2);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch client appointments" });
    }
  });
  app2.get("/api/portal/notes/:email", async (req, res) => {
    try {
      const notes = await storage.getSessionNotesByEmail(req.params.email);
      res.json(notes);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch session notes" });
    }
  });
  app2.post("/api/portal/notes", async (req, res) => {
    try {
      const validatedData = insertSessionNoteSchema.parse(req.body);
      const note = await storage.createSessionNote(validatedData);
      res.status(201).json(note);
    } catch (error) {
      res.status(400).json({ error: "Invalid session note data" });
    }
  });
  app2.get("/api/portal/resources/:email", async (req, res) => {
    try {
      const resources2 = await storage.getResourcesByEmail(req.params.email);
      res.json(resources2);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch resources" });
    }
  });
  app2.post("/api/portal/resources", async (req, res) => {
    try {
      const validatedData = insertResourceSchema.parse(req.body);
      const resource = await storage.createResource(validatedData);
      res.status(201).json(resource);
    } catch (error) {
      res.status(400).json({ error: "Invalid resource data" });
    }
  });
  app2.get("/api/clients/:email", async (req, res) => {
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
  app2.post("/api/clients", async (req, res) => {
    try {
      const validatedData = insertClientSchema.parse(req.body);
      const client = await storage.createClient(validatedData);
      res.status(201).json(client);
    } catch (error) {
      res.status(400).json({ error: "Invalid client data" });
    }
  });
  const httpServer = createServer(app2);
  return httpServer;
}

// server/vite.ts
import express from "express";
import fs from "fs";
import path2 from "path";
import { createServer as createViteServer, createLogger } from "vite";

// vite.config.ts
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import runtimeErrorOverlay from "@replit/vite-plugin-runtime-error-modal";
var vite_config_default = defineConfig({
  plugins: [
    react(),
    runtimeErrorOverlay(),
    ...process.env.NODE_ENV !== "production" && process.env.REPL_ID !== void 0 ? [
      await import("@replit/vite-plugin-cartographer").then(
        (m) => m.cartographer()
      ),
      await import("@replit/vite-plugin-dev-banner").then(
        (m) => m.devBanner()
      )
    ] : []
  ],
  resolve: {
    alias: {
      "@": path.resolve(import.meta.dirname, "client", "src"),
      "@shared": path.resolve(import.meta.dirname, "shared"),
      "@assets": path.resolve(import.meta.dirname, "attached_assets")
    }
  },
  root: path.resolve(import.meta.dirname, "client"),
  build: {
    outDir: path.resolve(import.meta.dirname, "dist/public"),
    emptyOutDir: true
  },
  server: {
    fs: {
      strict: true,
      deny: ["**/.*"]
    }
  }
});

// server/vite.ts
import { nanoid } from "nanoid";
var viteLogger = createLogger();
function log(message, source = "express") {
  const formattedTime = (/* @__PURE__ */ new Date()).toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
    hour12: true
  });
  console.log(`${formattedTime} [${source}] ${message}`);
}
async function setupVite(app2, server) {
  const serverOptions = {
    middlewareMode: true,
    hmr: { server },
    allowedHosts: true
  };
  const vite = await createViteServer({
    ...vite_config_default,
    configFile: false,
    customLogger: {
      ...viteLogger,
      error: (msg, options) => {
        viteLogger.error(msg, options);
        process.exit(1);
      }
    },
    server: serverOptions,
    appType: "custom"
  });
  app2.use(vite.middlewares);
  app2.use("*", async (req, res, next) => {
    const url = req.originalUrl;
    try {
      const clientTemplate = path2.resolve(
        import.meta.dirname,
        "..",
        "client",
        "index.html"
      );
      let template = await fs.promises.readFile(clientTemplate, "utf-8");
      template = template.replace(
        `src="/src/main.tsx"`,
        `src="/src/main.tsx?v=${nanoid()}"`
      );
      const page = await vite.transformIndexHtml(url, template);
      res.status(200).set({ "Content-Type": "text/html" }).end(page);
    } catch (e) {
      vite.ssrFixStacktrace(e);
      next(e);
    }
  });
}
function serveStatic(app2) {
  const distPath = path2.resolve(import.meta.dirname, "public");
  if (!fs.existsSync(distPath)) {
    throw new Error(
      `Could not find the build directory: ${distPath}, make sure to build the client first`
    );
  }
  app2.use(express.static(distPath));
  app2.use("*", (_req, res) => {
    res.sendFile(path2.resolve(distPath, "index.html"));
  });
}

// server/index.ts
var app = express2();
app.use(express2.json());
app.use(express2.urlencoded({ extended: false }));
app.use((req, res, next) => {
  const start = Date.now();
  const path3 = req.path;
  let capturedJsonResponse = void 0;
  const originalResJson = res.json;
  res.json = function(bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };
  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path3.startsWith("/api")) {
      let logLine = `${req.method} ${path3} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }
      if (logLine.length > 80) {
        logLine = logLine.slice(0, 79) + "\u2026";
      }
      log(logLine);
    }
  });
  next();
});
(async () => {
  const server = await registerRoutes(app);
  app.use((err, _req, res, _next) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";
    res.status(status).json({ message });
    throw err;
  });
  if (app.get("env") === "development") {
    await setupVite(app, server);
  } else {
    serveStatic(app);
  }
  const port = parseInt(process.env.PORT || "5000", 10);
  const listenOptions = {
    port,
    host: "0.0.0.0"
  };
  if (process.platform !== "win32") {
    listenOptions.reusePort = true;
  }
  server.listen(listenOptions, () => {
    log(`serving on port ${port}`);
  });
})();
