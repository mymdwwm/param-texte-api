/* 
Routes pour la justification de texte
*/

import { Router, Request, Response } from "express";
import { authenticate, getTokenFromRequest } from "../middlewares/auth.middleware";
import { justifyText } from "../services/justify.service";
import { canProcessWords, countWords, recordUsage, getRemainingWords } from "../services/rateLimit.service";

export const justifyRouter = Router(); // Création du router


justifyRouter.post(
  "/justify",
  authenticate, // Middleware : vérifie le token AVANT d'exécuter la route
  (req: Request, res: Response) => {
    try {
      //  Récupérer le texte depuis le body (string)
      const text = req.body;

      // texte existe et n'est pas vide
      if (!text || typeof text !== "string" || text.trim().length === 0) {
        res.status(400).json({
          error: "Le texte à justifier est requis (Content-Type: text/plain)",
        });
        return;
      }

      // Récupérer le token depuis la requête -> token dans req
      const token = getTokenFromRequest(req);

      // Sécurité 
      if (!token) {
        res.status(401).json({
          error: "Token non trouvé",
        });
        return;
      }

      const wordCount = countWords(text); 

      if (!canProcessWords(token, wordCount)) {
        
        const remaining = getRemainingWords(token); // Repère du restant de nmbr de mots

        res.status(402).json({
          error: "Rate limit dépassé",
          message: `Payement Require. Mots restants aujourd'hui : ${remaining}`,
          remaining: remaining,
          requested: wordCount,
        });
        return;
      }

      const justifiedText = justifyText(text, 80);

      recordUsage(token, wordCount);

      res.status(200).type("text/plain").send(justifiedText);

    } catch (error) {
      console.error("Erreur lors de la justification:", error);
      res.status(500).json({
        error: "Erreur lors de la justification du texte",
      });
    }
  }
);