# ArchiERP Morocco - Plan d'Architecture

## Architecture Technique
- **Frontend** : React 18 + Tailwind CSS + Framer Motion (widgets ludiques).
- **Backend** : Express.js (Node.js) servant de middleware API.
- **Base de Données** : SQLite (via `better-sqlite3`) pour le prototype, schéma compatible PostgreSQL.
- **Workflow** : Moteur de règles personnalisé inspiré du BPMN 2.0.
- **Intelligence Artificielle** : Google Gemini API pour l'OCR des documents ICE/RC.
- **Reporting** : PDFKit pour la génération de rapports de faisabilité.

## Structure des Répertoires
- `/src/components` : Composants UI & Widgets.
- `/src/services` : Appels API frontend.
- `/server/` : Code source du backend Express.
- `/server/services/` : Logique métier (Groovy-like logic in TS, Gemini Integration).
- `/server/db/` : Initialisation et requêtes SQL.
