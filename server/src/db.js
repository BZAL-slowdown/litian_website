import Database from "better-sqlite3";
import bcrypt from "bcryptjs";
import { cases, notices, pages } from "./content.js";

const now = () => new Date().toISOString();

export function createDatabase(databasePath = "./data/litian.sqlite") {
  const db = new Database(databasePath);
  db.pragma("journal_mode = WAL");
  db.pragma("foreign_keys = ON");
  return db;
}

export function migrate(db) {
  db.exec(`
    CREATE TABLE IF NOT EXISTS pages (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      slug TEXT NOT NULL UNIQUE,
      title TEXT NOT NULL,
      subtitle TEXT NOT NULL DEFAULT '',
      summary TEXT NOT NULL DEFAULT '',
      category TEXT NOT NULL DEFAULT '',
      sections_json TEXT NOT NULL DEFAULT '[]',
      is_published INTEGER NOT NULL DEFAULT 1,
      sort_order INTEGER NOT NULL DEFAULT 0,
      updated_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS cases (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      type TEXT NOT NULL,
      style TEXT NOT NULL DEFAULT '',
      area TEXT NOT NULL DEFAULT '',
      cover TEXT NOT NULL DEFAULT '',
      summary TEXT NOT NULL DEFAULT '',
      is_published INTEGER NOT NULL DEFAULT 1,
      updated_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS notices (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      body TEXT NOT NULL,
      is_published INTEGER NOT NULL DEFAULT 1,
      updated_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT NOT NULL UNIQUE,
      password_hash TEXT NOT NULL,
      role TEXT NOT NULL CHECK(role IN ('admin','employee','customer')),
      name TEXT NOT NULL DEFAULT '',
      phone TEXT NOT NULL DEFAULT '',
      email TEXT NOT NULL DEFAULT '',
      created_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS appointments (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      phone TEXT NOT NULL,
      appointment_time TEXT NOT NULL,
      service_type TEXT NOT NULL,
      message TEXT NOT NULL DEFAULT '',
      status TEXT NOT NULL DEFAULT '待跟进',
      created_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS sales_leads (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      phone TEXT NOT NULL,
      source TEXT NOT NULL DEFAULT '',
      service_type TEXT NOT NULL DEFAULT '',
      notes TEXT NOT NULL DEFAULT '',
      status TEXT NOT NULL DEFAULT '新线索',
      created_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS employees (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      phone TEXT NOT NULL DEFAULT '',
      position TEXT NOT NULL DEFAULT '',
      department TEXT NOT NULL DEFAULT '',
      notes TEXT NOT NULL DEFAULT '',
      created_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS customers (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      phone TEXT NOT NULL,
      project_type TEXT NOT NULL DEFAULT '',
      project_status TEXT NOT NULL DEFAULT '咨询中',
      notes TEXT NOT NULL DEFAULT '',
      created_at TEXT NOT NULL
    );
  `);
}

export function seed(db, env = process.env) {
  const pageCount = db.prepare("SELECT COUNT(*) AS count FROM pages").get().count;
  if (pageCount === 0) {
    const insertPage = db.prepare(`
      INSERT INTO pages (slug, title, subtitle, summary, category, sections_json, sort_order, updated_at)
      VALUES (@slug, @title, @subtitle, @summary, @category, @sections_json, @sort_order, @updated_at)
    `);
    const insertAll = db.transaction(() => {
      pages.forEach((page, index) => {
        insertPage.run({
          ...page,
          sections_json: JSON.stringify(page.sections),
          sort_order: index + 1,
          updated_at: now()
        });
      });
    });
    insertAll();
  }

  const caseCount = db.prepare("SELECT COUNT(*) AS count FROM cases").get().count;
  if (caseCount === 0) {
    const insertCase = db.prepare(`
      INSERT INTO cases (title, type, style, area, cover, summary, updated_at)
      VALUES (@title, @type, @style, @area, @cover, @summary, @updated_at)
    `);
    cases.forEach((item) => insertCase.run({ ...item, updated_at: now() }));
  }

  const noticeCount = db.prepare("SELECT COUNT(*) AS count FROM notices").get().count;
  if (noticeCount === 0) {
    const insertNotice = db.prepare(`
      INSERT INTO notices (title, body, updated_at)
      VALUES (@title, @body, @updated_at)
    `);
    notices.forEach((item) => insertNotice.run({ ...item, updated_at: now() }));
  }

  const userCount = db.prepare("SELECT COUNT(*) AS count FROM users").get().count;
  if (userCount === 0) {
    const password = env.ADMIN_PASSWORD || "change-me-now";
    db.prepare(`
      INSERT INTO users (username, password_hash, role, name, created_at)
      VALUES (?, ?, 'admin', '系统管理员', ?)
    `).run(env.ADMIN_USERNAME || "admin", bcrypt.hashSync(password, 10), now());
  }
}

export function serializePage(row) {
  return {
    ...row,
    sections: JSON.parse(row.sections_json || "[]"),
    is_published: Boolean(row.is_published)
  };
}
