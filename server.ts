import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import { fileURLToPath } from "url";
import { initDatabase } from "./server/db/setup.ts";
import projectRouter from "./server/routes/projets.ts";
import { GeminiOCRService } from "./server/services/GeminiOCRService.ts";
import pdfRouter from "./server/routes/pdf.ts";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Initialize DB
  initDatabase();

  app.use(express.json());

  // API Routes
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok", app: "ArchiERP Morocco" });
  });

  // Dossier 360 Route
  app.use("/api/projets", projectRouter);

  // Magic Onboarding - Gemini OCR
  const gemini = new GeminiOCRService();

  app.post("/api/onboarding/ocr", async (req, res) => {
    try {
      const { fileBase64, mimeType } = req.body;
      const data = await gemini.extractCabinetData(fileBase64, mimeType);
      res.json(data);
    } catch (err) {
      res.status(500).json({ error: (err as Error).message });
    }
  });

  // Profitability Route
  app.post("/api/finance/profitability", (req, res) => {
    const { envelope } = req.body;
    const ratios: Record<string, number> = {
      "Terrassement": 0.0151,
      "Gros Oeuvre Fondation": 0.0474,
      "Ossature": 0.2613,
      "Cloisons & Enduits": 0.1188,
      "Etanchéité": 0.0250,
      "Revêtements": 0.1500,
      "Menuiserie": 0.1800,
      "Plomberie": 0.0800,
      "Electricité": 0.0700,
      "Peinture & Divers": 0.0524,
    };

    const details = Object.entries(ratios).map(([key, ratio]) => ({
      lot: key,
      montant: Number((envelope * ratio).toFixed(2))
    }));

    res.json({ envelope, details });
  });

  // PDF Generation Route
  app.use("/api/pdf", pdfRouter);

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
