import PDFDocument from "pdfkit";
import fs from "fs";
import { Router } from "express";

const router = Router();

/**
 * Service de génération de Rapport de Faisabilité PDF
 */
router.post("/generate", (req, res) => {
  const { project, study } = req.body;
  
  const doc = new PDFDocument({ margin: 50 });
  const filename = `Rapport_Faisabilite_${project.nom_projet.replace(/\s/g, '_')}.pdf`;

  // Headers pour le téléchargement
  res.setHeader("Content-Type", "application/pdf");
  res.setHeader("Content-Disposition", `attachment; filename=${filename}`);

  doc.pipe(res);

  // --- Header ---
  doc.fontSize(20).text("RAPPORT DE FAISABILITÉ", { align: "center", underline: true });
  doc.moveDown();
  doc.fontSize(14).text(`Cabinet d'Architecture : ${project.cabinet_nom || "ArchiERP Morocco"}`);
  doc.text(`Date : ${new Date().toLocaleDateString("fr-FR")}`);
  doc.moveDown();

  // --- Project Info ---
  doc.fontSize(16).fillColor("#2c3e50").text("1. Détails du Projet");
  doc.rect(50, doc.y, 500, 2).fill("#3498db");
  doc.moveDown();
  doc.fillColor("black").fontSize(12).text(`Nom du Projet : ${project.nom_projet}`);
  doc.text(`Titre Foncier : ${project.titre_foncier || "N/A"}`);
  doc.text(`Surface Terrain : ${project.surface_terrain || 0} m²`);
  doc.text(`Commune : ${project.commune || "N/A"}`);
  doc.moveDown();

  // --- Profitability ---
  doc.fontSize(16).fillColor("#2c3e50").text("2. Étude de Rentabilité");
  doc.rect(50, doc.y, 500, 2).fill("#e67e22");
  doc.moveDown();
  doc.fillColor("black").text(`Enveloppe d'Investissement : ${study.envelope.toLocaleString()} MAD`);
  doc.moveDown();

  doc.fontSize(10);
  study.details.forEach((lot: any) => {
    doc.text(`${lot.lot.padEnd(30, ".")} ${lot.montant.toLocaleString()} MAD`);
  });

  // --- Footer ---
  doc.moveDown();
  doc.fontSize(8).fillColor("grey").text("Généré par ArchiERP Morocco - Solution ERP/CRM pour Architectes", { align: "center" });

  doc.end();
});

export default router;
