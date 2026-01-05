/* Middleware d'authentification via token*/

import { Request, Response, NextFunction } from "express";
import { verifyToken } from "../services/token.service";

export function authenticate(req: Request, res: Response, next: NextFunction): void {
    const authHeader = req.headers.authorization; // Récupération

    if (!authHeader) { 
        res.status(401).json({ 
          error: "Token manquant. Utilisez le header Authorization: Bearer <token>" 
        });
        return; // Arrête l'exécution
      }

      const parts = authHeader.split(" "); // Extraction du token

      if (parts.length !== 2 || parts[0] !== "Bearer") { // Vérifie le format
        res.status(401).json({ 
          error: "Format du token invalide. Utilisez : Bearer <token>" 
        });
        return;
      }

      const token = parts[1]; // Le token sans "Bearer"

      if (!verifyToken(token)) { // si valide
        res.status(401).json({ 
          error: "Token invalide ou expiré" 
        });
        return;
      }
      (req as any).token = token; // facultatif
      next(); // route suivante
}

// Récupère depuis la requête avec route sécurisées
export function getTokenFromRequest(req: Request): string | undefined {
    return (req as any).token;
  }