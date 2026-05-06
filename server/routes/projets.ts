import { Router } from "express";
import { getDb } from "../db/setup.js";

const router = Router();

/**
 * Agrégateur Dossier 360°
 * Récupère Projet + Foncier + Workflow status
 */
router.get("/:id", (req, res) => {
  const db = getDb();
  const { id } = req.params;

  try {
    const projet = db.prepare(`
      SELECT p.*, f.titre_foncier, f.surface_terrain, f.zonage_urbanisme, f.commune
      FROM projets p
      LEFT JOIN fonciers f ON p.foncier_id = f.id
      WHERE p.id = ?
    `).get(id) as any;

    if (!projet) {
      return res.status(404).json({ error: "Projet non trouvé" });
    }

    // Timeline fictive basée sur le statut (Simulation BPMN)
    const timeline = [
      { label: "Esquisse", status: "completed", date: projet.created_at },
      { label: "Avant-Projet", status: projet.statut === "ESQUISSE" ? "pending" : "completed" },
      { label: "Autorisation", status: projet.statut === "AUTORISATION" ? "current" : "pending" },
      { label: "Chantier", status: "pending" },
    ] as any[];

    res.json({
      ...(projet as object),
      timeline,
      tasks: [
        { id: 1, text: "Vérifier conformité zonage", done: true },
        { id: 2, text: "Préparer plans de masse", done: projet.statut !== "ESQUISSE" },
        { id: 3, text: "Dépôt Rokhas", done: false },
      ],
      ged: [
        { id: 1, name: "Plan_Masse.pdf", size: "1.2MB" },
        { id: 2, name: "Note_Présentation.pdf", size: "450KB" },
      ]
    });
  } catch (err) {
    res.status(500).json({ error: (err as Error).message });
  }
});

export default router;
