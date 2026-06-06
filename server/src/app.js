import path from "node:path";
import { fileURLToPath } from "node:url";
import bcrypt from "bcryptjs";
import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import jwt from "jsonwebtoken";
import morgan from "morgan";
import { z } from "zod";
import { createDatabase, migrate, seed, serializePage } from "./db.js";

dotenv.config();

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const now = () => new Date().toISOString();
const jwtSecret = () => process.env.JWT_SECRET || "dev-secret-change-me";

const pageSchema = z.object({
  title: z.string().min(1),
  subtitle: z.string().default(""),
  summary: z.string().default(""),
  category: z.string().default(""),
  sections: z.array(z.object({ heading: z.string().default(""), body: z.string().default("") })).default([]),
  is_published: z.boolean().default(true),
  sort_order: z.number().int().default(0)
});

const caseSchema = z.object({
  title: z.string().min(1),
  type: z.string().min(1),
  style: z.string().default(""),
  area: z.string().default(""),
  cover: z.string().url().or(z.literal("")).default(""),
  summary: z.string().default(""),
  is_published: z.boolean().default(true)
});

function sign(user) {
  return jwt.sign({ id: user.id, role: user.role, username: user.username }, jwtSecret(), { expiresIn: "8h" });
}

function requireAuth(roles = ["admin"]) {
  return (req, res, next) => {
    const token = req.headers.authorization?.replace("Bearer ", "");
    if (!token) return res.status(401).json({ message: "未登录" });
    try {
      const payload = jwt.verify(token, jwtSecret());
      if (!roles.includes(payload.role)) return res.status(403).json({ message: "权限不足" });
      req.user = payload;
      next();
    } catch {
      res.status(401).json({ message: "登录已过期" });
    }
  };
}

export function createApp(options = {}) {
  const app = express();
  const db = options.db || createDatabase(process.env.DATABASE_PATH || "./data/litian.sqlite");
  migrate(db);
  seed(db);

  app.locals.db = db;
  app.use(cors());
  app.use(express.json({ limit: "1mb" }));
  app.use(morgan("dev"));

  app.get("/api/health", (_req, res) => res.json({ ok: true, time: now() }));

  app.get("/api/public/site", (_req, res) => {
    const pages = db.prepare("SELECT * FROM pages WHERE is_published = 1 ORDER BY sort_order, id").all().map(serializePage);
    const cases = db.prepare("SELECT * FROM cases WHERE is_published = 1 ORDER BY id DESC").all();
    const notices = db.prepare("SELECT * FROM notices WHERE is_published = 1 ORDER BY id DESC").all();
    res.json({ pages, cases, notices });
  });

  app.get("/api/public/pages/:slug", (req, res) => {
    const page = db.prepare("SELECT * FROM pages WHERE slug = ? AND is_published = 1").get(req.params.slug);
    if (!page) return res.status(404).json({ message: "页面不存在" });
    res.json(serializePage(page));
  });

  app.post("/api/auth/login", (req, res) => {
    const schema = z.object({ username: z.string().min(1), password: z.string().min(1), role: z.enum(["admin", "employee", "customer"]).optional() });
    const data = schema.parse(req.body);
    const user = db.prepare("SELECT * FROM users WHERE username = ?").get(data.username);
    if (!user || (data.role && user.role !== data.role) || !bcrypt.compareSync(data.password, user.password_hash)) {
      return res.status(401).json({ message: "账号或密码错误" });
    }
    res.json({ token: sign(user), user: { id: user.id, username: user.username, role: user.role, name: user.name } });
  });

  app.post("/api/auth/register", (req, res) => {
    const schema = z.object({ phone: z.string().min(6), password: z.string().min(6), name: z.string().default("") });
    const data = schema.parse(req.body);
    const existing = db.prepare("SELECT id FROM users WHERE username = ?").get(data.phone);
    if (existing) return res.status(409).json({ message: "手机号已注册" });
    const result = db.prepare("INSERT INTO users (username, password_hash, role, name, phone, created_at) VALUES (?, ?, 'customer', ?, ?, ?)")
      .run(data.phone, bcrypt.hashSync(data.password, 10), data.name, data.phone, now());
    db.prepare("INSERT INTO customers (name, phone, created_at) VALUES (?, ?, ?)").run(data.name || "客户", data.phone, now());
    res.status(201).json({ id: result.lastInsertRowid });
  });

  app.post("/api/appointments", (req, res) => {
    const schema = z.object({
      name: z.string().min(1),
      phone: z.string().min(6),
      appointment_time: z.string().min(1),
      service_type: z.enum(["住宅", "商业"]),
      message: z.string().default("")
    });
    const data = schema.parse(req.body);
    const result = db.prepare(`
      INSERT INTO appointments (name, phone, appointment_time, service_type, message, created_at)
      VALUES (@name, @phone, @appointment_time, @service_type, @message, @created_at)
    `).run({ ...data, created_at: now() });
    res.status(201).json({ id: result.lastInsertRowid });
  });

  app.get("/api/admin/pages", requireAuth(), (_req, res) => {
    res.json(db.prepare("SELECT * FROM pages ORDER BY sort_order, id").all().map(serializePage));
  });

  app.put("/api/admin/pages/:slug", requireAuth(), (req, res) => {
    const data = pageSchema.parse(req.body);
    const result = db.prepare(`
      UPDATE pages
      SET title=@title, subtitle=@subtitle, summary=@summary, category=@category,
          sections_json=@sections_json, is_published=@is_published, sort_order=@sort_order, updated_at=@updated_at
      WHERE slug=@slug
    `).run({
      ...data,
      slug: req.params.slug,
      sections_json: JSON.stringify(data.sections),
      is_published: data.is_published ? 1 : 0,
      updated_at: now()
    });
    if (!result.changes) return res.status(404).json({ message: "页面不存在" });
    res.json({ ok: true });
  });

  app.get("/api/admin/cases", requireAuth(), (_req, res) => {
    res.json(db.prepare("SELECT * FROM cases ORDER BY id DESC").all());
  });

  app.post("/api/admin/cases", requireAuth(), (req, res) => {
    const data = caseSchema.parse(req.body);
    const result = db.prepare(`
      INSERT INTO cases (title, type, style, area, cover, summary, is_published, updated_at)
      VALUES (@title, @type, @style, @area, @cover, @summary, @is_published, @updated_at)
    `).run({ ...data, is_published: data.is_published ? 1 : 0, updated_at: now() });
    res.status(201).json({ id: result.lastInsertRowid });
  });

  app.put("/api/admin/cases/:id", requireAuth(), (req, res) => {
    const data = caseSchema.parse(req.body);
    db.prepare(`
      UPDATE cases SET title=@title, type=@type, style=@style, area=@area, cover=@cover,
      summary=@summary, is_published=@is_published, updated_at=@updated_at WHERE id=@id
    `).run({ ...data, id: req.params.id, is_published: data.is_published ? 1 : 0, updated_at: now() });
    res.json({ ok: true });
  });

  app.delete("/api/admin/cases/:id", requireAuth(), (req, res) => {
    db.prepare("DELETE FROM cases WHERE id = ?").run(req.params.id);
    res.json({ ok: true });
  });

  app.get("/api/admin/notices", requireAuth(), (_req, res) => {
    res.json(db.prepare("SELECT * FROM notices ORDER BY id DESC").all());
  });

  app.post("/api/admin/notices", requireAuth(), (req, res) => {
    const data = z.object({ title: z.string().min(1), body: z.string().min(1), is_published: z.boolean().default(true) }).parse(req.body);
    const result = db.prepare("INSERT INTO notices (title, body, is_published, updated_at) VALUES (?, ?, ?, ?)")
      .run(data.title, data.body, data.is_published ? 1 : 0, now());
    res.status(201).json({ id: result.lastInsertRowid });
  });

  app.get("/api/admin/:table", requireAuth(), (req, res) => {
    const allowed = new Set(["appointments", "sales_leads", "employees", "customers"]);
    if (!allowed.has(req.params.table)) return res.status(404).json({ message: "资源不存在" });
    res.json(db.prepare(`SELECT * FROM ${req.params.table} ORDER BY id DESC`).all());
  });

  app.post("/api/admin/sales_leads", requireAuth(), (req, res) => {
    const data = z.object({
      name: z.string().min(1),
      phone: z.string().min(6),
      source: z.string().default(""),
      service_type: z.string().default(""),
      notes: z.string().default("")
    }).parse(req.body);
    const result = db.prepare("INSERT INTO sales_leads (name, phone, source, service_type, notes, created_at) VALUES (?, ?, ?, ?, ?, ?)")
      .run(data.name, data.phone, data.source, data.service_type, data.notes, now());
    res.status(201).json({ id: result.lastInsertRowid });
  });

  app.post("/api/admin/employees", requireAuth(), (req, res) => {
    const data = z.object({
      name: z.string().min(1),
      phone: z.string().default(""),
      position: z.string().default(""),
      department: z.string().default(""),
      notes: z.string().default("")
    }).parse(req.body);
    const result = db.prepare("INSERT INTO employees (name, phone, position, department, notes, created_at) VALUES (?, ?, ?, ?, ?, ?)")
      .run(data.name, data.phone, data.position, data.department, data.notes, now());
    res.status(201).json({ id: result.lastInsertRowid });
  });

  app.post("/api/admin/customers", requireAuth(), (req, res) => {
    const data = z.object({
      name: z.string().min(1),
      phone: z.string().min(6),
      project_type: z.string().default(""),
      project_status: z.string().default("咨询中"),
      notes: z.string().default("")
    }).parse(req.body);
    const result = db.prepare("INSERT INTO customers (name, phone, project_type, project_status, notes, created_at) VALUES (?, ?, ?, ?, ?, ?)")
      .run(data.name, data.phone, data.project_type, data.project_status, data.notes, now());
    res.status(201).json({ id: result.lastInsertRowid });
  });

  const dist = path.resolve(__dirname, "../../client/dist");
  app.use(express.static(dist));
  app.get("/{*splat}", (req, res, next) => {
    if (req.path.startsWith("/api")) return next();
    res.sendFile(path.join(dist, "index.html"));
  });

  app.use((err, _req, res, _next) => {
    if (err instanceof z.ZodError) return res.status(400).json({ message: "参数错误", details: err.issues });
    res.status(500).json({ message: "服务器错误" });
  });

  return app;
}
