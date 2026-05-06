import { GoogleGenAI } from "@google/genai";

/**
 * Service d'intégration Gemini pour l'OCR intelligent
 * ArchiERP Morocco
 */
export class GeminiOCRService {
  private genAI: GoogleGenAI;

  constructor() {
    const apiKey = process.env.GEMINI_API_KEY || "";
    this.genAI = new GoogleGenAI({ apiKey });
  }

  /**
   * Analyse un document (ICE, RC) pour extraire les données du cabinet
   * @param fileBase64 Données du fichier en base64
   * @param mimeType Type MIME du fichier (image/jpeg, application/pdf, etc.)
   */
  async extractCabinetData(fileBase64: string, mimeType: string) {
    const model = (this.genAI as any).getGenerativeModel({ model: "gemini-2.0-flash" });

    const prompt = `
      Tu es un expert administratif marocain. Analyse ce document (Registre de Commerce ou Certificat ICE) 
      et extrais les informations suivantes au format JSON strict :
      {
        "raisonSociale": "Nom complet de l'entreprise",
        "ice": "Identifiant Commun de l'Entreprise (15 chiffres)",
        "rc": "Numéro de Registre de Commerce",
        "if": "Identifiant Fiscal",
        "adresse": "Adresse complète",
        "ville": "Ville du siège"
      }
      Si une information est illisible ou absente, mets une chaîne vide. Retourne uniquement le JSON.
    `;

    const result = await model.generateContent([
      prompt,
      {
        inlineData: {
          data: fileBase64,
          mimeType: mimeType,
        },
      },
    ]);

    const response = await result.response;
    const text = response.text();
    
    // Nettoyage de la réponse pour parser le JSON
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]);
    }
    throw new Error("Impossible de structurer les données du document.");
  }
}
