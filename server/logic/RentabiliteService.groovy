/**
 * @license
 * ArchiERP Morocco - Logiciel SaaS B2B
 * ÉTUDE DE RENTABILITÉ - MOTEUR DE CALCUL GROOVY
 */

package ma.archierp.logic

import groovy.json.JsonOutput

class RentabiliteService {

    /**
     * Ratios de construction standards pour le marché marocain (Moyen Standing/Mixte)
     */
    static final Map RATIOS = [
        "Terrassement"            : 0.0151, // 1.51%
        "Gros Oeuvre Fondation"   : 0.0474, // 4.74%
        "Ossature"                : 0.2613, // 26.13%
        "Cloisons & Enduits"      : 0.1188, // 11.88%
        "Etanchéité"              : 0.0250, // 2.50%
        "Revêtements"             : 0.1500, // 15.00%
        "Menuiserie (Bois/Alu)"   : 0.1800, // 18.00%
        "Plomberie & Sanitaire"   : 0.0800, // 8.00%
        "Electricité"             : 0.0700, // 7.00%
        "Peinture & Divers"       : 0.0524  // 5.24%
    ]

    /**
     * Calcule la ventilation de l'investissement
     * @param enveloppeTotale Enveloppe budgétaire en Dirhams (MAD)
     * @return Map contenant la ventilation détaillée
     */
    Map calculerVentilation(BigDecimal enveloppeTotale) {
        if (enveloppeTotale <= 0) throw new IllegalArgumentException("L'enveloppe doit être positive")

        Map ventilation = [:]
        BigDecimal sommeVerification = 0

        RATIOS.each { lot, ratio ->
            BigDecimal montantLot = (enveloppeTotale * ratio).setScale(2, BigDecimal.ROUND_HALF_UP)
            ventilation[lot] = montantLot
            sommeVerification += montantLot
        }

        // Ajustement du reliquat sur le dernier lot pour garantir 100%
        if (sommeVerification != enveloppeTotale) {
            BigDecimal diff = enveloppeTotale - sommeVerification
            ventilation["Peinture & Divers"] = (ventilation["Peinture & Divers"] + diff).setScale(2, BigDecimal.ROUND_HALF_UP)
        }

        return [
            enveloppe: enveloppeTotale,
            details: ventilation,
            meta: [
                devise: "MAD",
                dateCalcul: new Date().format("yyyy-MM-dd HH:mm:ss")
            ]
        ]
    }

    /**
     * Simulation Rapide de Faisabilité
     */
    BigDecimal calculerProfitabilite(BigDecimal investissement, BigDecimal surfaceVente, BigDecimal prixM2Moyen) {
        BigDecimal CA = surfaceVente * prixM2Moyen
        return (CA - investissement)
    }
}
