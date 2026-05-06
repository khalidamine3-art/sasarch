import Database from "better-sqlite3";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dbPath = path.join(process.cwd(), "archierp.db");

export function initDatabase() {
  const db = new Database(dbPath);
  
  // Enable foreign keys
  db.pragma("foreign_keys = ON");

  // DDL Script (Compatible with SQLite for demonstration)
  const ddl = `
    CREATE TABLE IF NOT EXISTS cabinets (
      id TEXT PRIMARY KEY,
      raison_sociale TEXT NOT NULL,
      ice TEXT UNIQUE NOT NULL,
      rc TEXT,
      patente TEXT,
      if_fiscal TEXT,
      adresse TEXT,
      ville TEXT,
      logo_url TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS utilisateurs (
      id TEXT PRIMARY KEY,
      cabinet_id TEXT NOT NULL,
      email TEXT UNIQUE NOT NULL,
      password_hash TEXT NOT NULL,
      nom TEXT,
      prenom TEXT,
      role TEXT CHECK(role IN ('ADMIN', 'CHEF_PROJET', 'DESSINATEUR', 'CLIENT')) DEFAULT 'CHEF_PROJET',
      is_active INTEGER DEFAULT 1,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (cabinet_id) REFERENCES cabinets(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS fonciers (
      id TEXT PRIMARY KEY,
      cabinet_id TEXT NOT NULL,
      titre_foncier TEXT NOT NULL,
      surface_terrain REAL NOT NULL,
      zonage_urbanisme TEXT,
      commune TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (cabinet_id) REFERENCES cabinets(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS projets (
      id TEXT PRIMARY KEY,
      cabinet_id TEXT NOT NULL,
      foncier_id TEXT,
      nom_projet TEXT NOT NULL,
      maitre_ouvrage TEXT,
      statut TEXT CHECK(statut IN ('ESQUISSE', 'AVANT_PROJET', 'AUTORISATION', 'CHANTIER', 'LIVRE')) DEFAULT 'ESQUISSE',
      budget_previsionnel REAL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (cabinet_id) REFERENCES cabinets(id) ON DELETE CASCADE,
      FOREIGN KEY (foncier_id) REFERENCES fonciers(id)
    );

    CREATE TABLE IF NOT EXISTS etudes_rentabilite (
      id TEXT PRIMARY KEY,
      projet_id TEXT NOT NULL,
      cabinet_id TEXT NOT NULL,
      enveloppe_totale REAL NOT NULL,
      ventilation_json TEXT, -- JSON string
      revenus_estimes REAL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (projet_id) REFERENCES projets(id) ON DELETE CASCADE,
      FOREIGN KEY (cabinet_id) REFERENCES cabinets(id) ON DELETE CASCADE
    );
  `;

  db.exec(ddl);
  console.log("Database initialized successfully.");
  return db;
}

export const getDb = () => new Database(dbPath);
